import { discord } from '@advents/common'
import { DeviceOs, prisma } from '@advents/db'
import { waitUntil } from '@vercel/functions'
import { Hono } from 'hono'
import { z } from 'zod'

import { handleAttribution } from '../../attributions'
import { getGeolocation } from '../../utils/geolocation'
import { ApiEnv } from '../api'

const deviceInputSchema = z.object({
  androidAaid: z.string().nullish(),
  androidId: z.string().nullish(),
  iosIdfv: z.string().nullish(),
  iosIdfa: z.string().nullish(),
})

type DeviceInput = z.infer<typeof deviceInputSchema>

const installInputSchema = z.object({
  installTime: z.string().transform(date => new Date(date)),
})

type InstallInput = z.infer<typeof installInputSchema>

const sessionInputSchema = z.object({
  id: z.string().nullish(),
  sdkName: z.string(),
  sdkVersion: z.string(),
  framework: z.string(),
  deviceTime: z.string().transform(date => new Date(date)),
  os: z.enum(['android', 'ios']),
  package: z.string(),
  isFirstSession: z.boolean(),

  androidInstallReferrer: z.string().nullish(),
  iosAttPermissionStatus: z.string().nullish(),
  iosClipboardClickId: z.string().nullish(),
  iosDeviceModelId: z.string().nullish(),
  userAgent: z.string().nullish(),
  deviceName: z.string().nullish(),
  deviceBrand: z.string().nullish(),
  deviceModel: z.string().nullish(),
  deviceType: z.string().nullish(),
  osVersion: z.string().nullish(),
  osBuildId: z.string().nullish(),
  appVersion: z.string().nullish(),
})

export const logSession = (api: Hono<ApiEnv>) =>
  api.post(
    '/sessions', //
    async c => {
      try {
        const input = await c.req.json()

        const sessionInput = sessionInputSchema.parse(input)
        const deviceInput = deviceInputSchema.parse(input)
        const installInput = installInputSchema.parse(input)

        const appId = c.var.appId

        console.log({
          sessionInput,
          deviceInput,
          installInput,
          deviceId: c.var.deviceId,
          appId,
        })

        const { deviceId, hadToUpdateDeviceId } = await handleDeviceData(
          deviceInput,
          c.var.deviceId,
          sessionInput.os,
          appId,
        )

        const { installId, isReinstall } = await handleInstallData(installInput, deviceId, appId)

        console.log({ deviceId, hadToUpdateDeviceId, installId, isReinstall })

        const geolocation = getGeolocation(c.req.raw)

        const session = await prisma.session.create({
          data: {
            ...sessionInput,
            id: sessionInput.id ?? undefined,
            hadToUpdateDeviceId,
            isReinstall,
            clearedAppLocalData: hadToUpdateDeviceId && !isReinstall,
            ...geolocation,
            deviceId,
            installId,
            appId,
          },
        })

        waitUntil(handleAttribution(session))

        const response = {
          device: hadToUpdateDeviceId
            ? {
                updatedDeviceId: deviceId,
              }
            : null,
        }

        return c.json(response, 200)
      } catch (error) {
        discord.sendErrorLog({
          description: 'Erro na `logSession`',
          error,
        })

        throw error
      }
    },
  )

type HandleDeviceDataResult = {
  deviceId: string
  hadToUpdateDeviceId: boolean
}

const handleDeviceData = async (
  deviceInput: DeviceInput,
  internalDeviceId: string,
  os: DeviceOs,
  appId: string,
): Promise<HandleDeviceDataResult> => {
  const { androidAaid, androidId, iosIdfa, iosIdfv } = deviceInput

  let device = await prisma.device.findFirst({
    where: {
      appId,
      ...(os === 'android'
        ? {
            OR: [
              {
                androidAaid: androidAaid ?? undefined,
              },
              {
                androidId: androidId ?? undefined,
              },
            ],
          }
        : {
            OR: [
              {
                iosIdfa: iosIdfa ?? undefined,
              },
              {
                iosIdfv: iosIdfv ?? undefined,
              },
            ],
          }),
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      androidAaid: true,
      androidId: true,
      iosIdfa: true,
      iosIdfv: true,
    },
  })

  const hadToUpdateDeviceId = !!device && device.id !== internalDeviceId

  const needToUpdateDeviceData =
    !!device &&
    ((!!androidAaid && androidAaid !== device.androidAaid) ||
      (!!androidId && androidId !== device.androidId) ||
      (!!iosIdfa && iosIdfa !== device.iosIdfa) ||
      (!!iosIdfv && iosIdfv !== device.iosIdfv))

  console.log({ device, hadToUpdateDeviceId, needToUpdateDeviceData })

  if (needToUpdateDeviceData) {
    device = await prisma.device.update({
      where: {
        id: device!.id,
      },
      data: {
        androidAaid: androidAaid ?? undefined,
        androidId: androidId ?? undefined,
        iosIdfa: iosIdfa ?? undefined,
        iosIdfv: iosIdfv ?? undefined,
      },
    })
  }

  if (!device) {
    device = await prisma.device.create({
      data: {
        id: internalDeviceId,
        os,
        androidAaid,
        androidId,
        iosIdfa,
        iosIdfv,
        appId,
      },
    })
  }

  return {
    deviceId: device.id,
    hadToUpdateDeviceId,
  }
}

type HandleInstallDataResult = {
  installId: string
  isReinstall: boolean
}

const handleInstallData = async (
  installInput: InstallInput,
  deviceId: string,
  appId: string,
): Promise<HandleInstallDataResult> => {
  const { installTime: sessionInstallTime } = installInput

  let install = await prisma.install.findFirst({
    where: {
      deviceId,
    },
    orderBy: {
      installTime: 'desc',
    },
    select: {
      id: true,
      installTime: true,
    },
  })

  const isReinstall = !!install && sessionInstallTime > install.installTime

  console.log({ install, isReinstall })

  if (!install || isReinstall) {
    install = await prisma.install.create({
      data: {
        installTime: sessionInstallTime,
        deviceId,
        appId,
      },
      select: {
        id: true,
        installTime: true,
      },
    })
  }

  return {
    installId: install.id,
    isReinstall,
  }
}
