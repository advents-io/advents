import { prisma, Session as DbSession } from '@advents/db'
import { waitUntil } from '@vercel/functions'
import { Hono } from 'hono'

import { handleAttribution } from '../../attributions'
import { getGeolocation } from '../../utils/geolocation'
import { authMiddleware } from '../auth-middleware'

export type SessionInput = Pick<
  DbSession,
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
  | 'ip'
  | 'continent'
  | 'country'
  | 'city'
  | 'region'
  | 'latitude'
  | 'longitude'
>

export const logSession = (api: Hono) =>
  api.post(
    '/sessions', //
    authMiddleware, //
    async c => {
      const session = (await c.req.json()) as SessionInput
      const appId = c.var.appId
      const geolocation = getGeolocation(c.req.raw)

      const { id: sessionId } = await prisma.session.create({
        data: {
          ...session,
          ...geolocation,
          appId,
        },
        select: {
          id: true,
        },
      })

      waitUntil(handleAttribution(sessionId, session, appId))

      return new Response()
    },
  )
