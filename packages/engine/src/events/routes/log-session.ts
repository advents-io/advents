import { prisma, Session } from '@advents/db'
import { waitUntil } from '@vercel/functions'
import { Hono } from 'hono'

import { handleAttribution } from '../../attributions'
import { getGeolocation } from '../../utils/geolocation'
import { authMiddleware } from '../auth-middleware'

type SessionInput = Pick<
  Session,
  | 'id'
  | 'sdkName'
  | 'sdkVersion'
  | 'framework'
  | 'deviceTime'
  | 'os'
  | 'package'
  | 'androidAaid'
  | 'androidId'
  | 'androidInstallReferrer'
  | 'iosIdfv'
  | 'iosIdfa'
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

export const logSession = (api: Hono) =>
  api.post(
    '/sessions', //
    authMiddleware, //
    async c => {
      const sessionInput = (await c.req.json()) as SessionInput

      const appId = c.var.appId
      const geolocation = getGeolocation(c.req.raw)

      const session = await prisma.session.create({
        data: {
          ...sessionInput,
          ...geolocation,
          appId,
        },
      })

      waitUntil(handleAttribution(session))

      return new Response()
    },
  )
