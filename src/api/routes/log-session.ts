import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import { authMiddleware } from '@/api/auth-middleware'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  sdkName: z.string(),
  sdkVersion: z.string(),
  os: z.string(),
  deviceTimestamp: z
    .string()
    .datetime()
    .transform(val => new Date(val)),

  androidId: z.string().nullable(),
  androidInstallReferrer: z.string().nullable(),
  installTime: z
    .string()
    .datetime()
    .nullable()
    .transform(val => (val ? new Date(val) : null)),
  userAgent: z.string().nullable(),
  deviceName: z.string().nullable(),
  deviceBrand: z.string().nullable(),
  deviceModel: z.string().nullable(),
  deviceYearClass: z.string().nullable(),
  osVersion: z.string().nullable(),
  appVersion: z.string().nullable(),
})

export const logSession = (api: Hono) =>
  api.post(
    '/sessions', //
    authMiddleware, //
    zValidator('json', schema), //
    async c => {
      const session = c.req.valid('json')

      const appId = c.var.appId

      await prisma.session.create({
        data: {
          ...session,
          appId,
        },
      })

      return new Response()
    },
  )
