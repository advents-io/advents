import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

const schema = z.object({
  sdkName: z.string(),
  sdkVersion: z.string(),
  os: z.string(),

  androidId: z.string().nullable(),
  androidInstallReferrer: z.string().nullable(),
  androidInstallTime: z
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
  timestamp: z
    .string()
    .datetime()
    .transform(val => new Date(val)),
})

export const logSession = (api: Hono) =>
  api.post('/session', zValidator('json', schema), async c => {
    const session = c.req.valid('json')

    await prisma.session.create({
      data: session,
    })

    return new Response()
  })
