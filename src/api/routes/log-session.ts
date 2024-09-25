import { Session as DbSession } from '@prisma/client'
import { waitUntil } from '@vercel/functions'
import { Hono } from 'hono'

import { authMiddleware } from '@/api/auth-middleware'
import { handleAttribution } from '@/attribution/attribution-handler'
import { getGeoData } from '@/helpers/request-helper'
import { prisma } from '@/lib/prisma'

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
