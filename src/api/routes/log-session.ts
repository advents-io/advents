import { zValidator } from '@hono/zod-validator'
import { Session } from '@prisma/client'
import { waitUntil } from '@vercel/functions'
import { Hono } from 'hono'
import { userAgent } from 'next/server'

import { authMiddleware } from '@/api/auth-middleware'
import { sessionSchema } from '@/api/schemas/session-schema'
import { handleAttribution } from '@/attribution/attribution-handler'
import { getGeoData } from '@/helpers/request-helper'
import { prisma } from '@/lib/prisma'

interface SessionInsert extends Omit<Session, 'id' | 'createdAt'> {}

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

      const sessionInsert: SessionInsert = {
        ...session,
        androidId: session.android?.deviceId || null,
        androidInstallReferrer: session.android?.installReferrer || null,
        userAgent: ua.ua || 'Unknown',
        ...geoData,
        appId,
      }

      const { id: sessionId } = await prisma.session.create({
        data: sessionInsert,
        select: {
          id: true,
        },
      })

      waitUntil(handleAttribution(sessionId, session))

      return new Response()
    },
  )
