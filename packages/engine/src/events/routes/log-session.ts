import { Device, DeviceOs, prisma, Session } from '@advents/db'
import { waitUntil } from '@vercel/functions'
import { Hono } from 'hono'

import { handleAttribution } from '../../attributions'
import { getGeolocation } from '../../utils/geolocation'
import { ApiEnv } from '../api'

type DeviceInput = Pick<Device, 'androidAaid' | 'androidId' | 'iosIdfv' | 'iosIdfa'>

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
  | 'installTime'
  | 'userAgent'
  | 'deviceName'
  | 'deviceBrand'
  | 'deviceModel'
  | 'deviceType'
  | 'osVersion'
  | 'osBuildId'
  | 'appVersion'
>

type LogSessionInput = DeviceInput & SessionInput

export const logSession = (api: Hono<ApiEnv>) =>
  api.post(
    '/sessions', //
    async c => {
      const { androidAaid, androidId, iosIdfa, iosIdfv, ...input } =
        (await c.req.json()) as LogSessionInput

      const appId = c.var.appId

      const { deviceId, isReinstall } = await handleDeviceData(
        {
          androidAaid,
          androidId,
          iosIdfa,
          iosIdfv,
        },
        c.var.deviceId,
        input.os,
        appId,
      )

      const geolocation = getGeolocation(c.req.raw)

      const session = await prisma.session.create({
        data: {
          ...input,
          isReinstall,
          ...geolocation,
          deviceId,
          appId,
        },
      })

      waitUntil(handleAttribution(session))

      const response = {
        device: isReinstall
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
  isReinstall: boolean
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

  const isReinstall = !!device && device.id !== internalDeviceId

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
    isReinstall,
  }
}
