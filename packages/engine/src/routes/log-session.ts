import { prisma, Session as DbSession } from '@advents/db'
import { waitUntil } from '@vercel/functions'
import { Hono } from 'hono'

import { handleAttribution } from '@/attribution/attribution-handler'
import { authMiddleware } from '@/auth-middleware'
import { getGeoData } from '@/request-helper'

export type Session = Pick<
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
  | 'deviceYearClass'
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
      const session = (await c.req.json()) as Session
      const appId = c.var.appId
      const geoData = getGeoData(c.req.raw)

      const { id: sessionId } = await prisma.session.create({
        data: {
          ...session,
          ...geoData,
          appId,
        },
        select: {
          id: true,
        },
      })

      waitUntil(handleAttribution(sessionId, session))

      return new Response()
    },
  )
