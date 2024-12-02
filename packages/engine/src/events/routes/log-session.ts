import { Device, DeviceOs, Install, prisma, Session } from '@advents/db'
import { waitUntil } from '@vercel/functions'
import { Hono } from 'hono'

import { handleAttribution } from '../../attributions'
import { getGeolocation } from '../../utils/geolocation'
import { ApiEnv } from '../api'

type DeviceInput = Pick<Device, 'androidAaid' | 'androidId' | 'iosIdfv' | 'iosIdfa'>

type InstallInput = Pick<Install, 'installTime'>

type SessionInput = Pick<
  Session,
  | 'id'
  | 'sdkName'
  | 'sdkVersion'
  | 'framework'
  | 'deviceTime'
  | 'os'
  | 'package'
  | 'isFirstSession'
  | 'androidInstallReferrer'
  | 'iosAttPermissionStatus'
  | 'iosClipboardClickId'
  | 'iosDeviceModelId'
  | 'userAgent'
  | 'deviceName'
  | 'deviceBrand'
  | 'deviceModel'
  | 'deviceType'
  | 'osVersion'
  | 'osBuildId'
  | 'appVersion'
>

type Input = DeviceInput & InstallInput & SessionInput

export const logSession = (api: Hono<ApiEnv>) =>
  api.post(
    '/sessions', //
    async c => {
      const { androidAaid, androidId, iosIdfv, iosIdfa, installTime, ...sessionInput } =
        (await c.req.json()) as Input

      const deviceInput: DeviceInput = {
        androidAaid,
        androidId,
        iosIdfv,
        iosIdfa,
      }

      const installInput: InstallInput = {
        installTime,
      }

      const appId = c.var.appId

      const { deviceId, hadToUpdateDeviceId } = await handleDeviceData(
        deviceInput,
        c.var.deviceId,
        sessionInput.os,
        appId,
      )

      const { installId, isReinstall } = await handleInstallData(installInput, deviceId, appId)

      const geolocation = getGeolocation(c.req.raw)

      const session = await prisma.session.create({
        data: {
          ...sessionInput,
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
            OR: [{ androidAaid: androidAaid ?? undefined }, { androidId: androidId ?? undefined }],
          }
        : {
            OR: [{ iosIdfa: iosIdfa ?? undefined }, { iosIdfv: iosIdfv ?? undefined }],
          }),
    },
  })

  const hadToUpdateDeviceId = !!device && device.id !== internalDeviceId

  const needToUpdateDeviceData =
    !!device &&
    ((androidAaid && androidAaid !== device.androidAaid) ||
      (androidId && androidId !== device.androidId) ||
      (iosIdfa && iosIdfa !== device.iosIdfa) ||
      (iosIdfv && iosIdfv !== device.iosIdfv))

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
