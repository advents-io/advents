import { zValidator } from '@hono/zod-validator'
import { waitUntil } from '@vercel/functions'
import { Hono } from 'hono'
import { userAgent } from 'next/server'

import { authMiddleware } from '@/api/auth-middleware'
import { sessionSchema } from '@/api/schemas/session-schema'
import { checkAttribution } from '@/attribution/attribution-handler'
import { getGeoData } from '@/helpers/request-helper'
import { prisma } from '@/lib/prisma'

export const logSession = (api: Hono) =>
  api.post(
    '/sessions', //
    authMiddleware, //
    zValidator('json', sessionSchema), //
    async c => {
      const session = c.req.valid('json')

      const appId = c.var.appId

      const ua = userAgent(c.req.raw)

      const geoData = getGeoData(c.req.raw)

      const { id: sessionId } = await prisma.session.create({
        data: {
          ...session,
          userAgent: ua.ua || 'Unknown',
          ...geoData,
          appId,
        },
        select: {
          id: true,
        },
      })

      waitUntil(checkAttribution(sessionId, session))

      return new Response()
    },
  )
