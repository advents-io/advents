import { prisma } from '@advents/db'
import { zValidator } from '@hono/zod-validator'
import { waitUntil } from '@vercel/functions'
import { Hono } from 'hono'
import { z } from 'zod'

import { ApiEnv } from '../api'

const input = z.object({
  value: z
    .number({ message: 'Purchase value is required.' })
    .min(0, { message: 'Purchase value must be greater than 0.' }),
  sessionId: z
    .string({ message: 'Session ID is required.' })
    .uuid({ message: 'Invalid session ID.' }),
})

export const logPurchase = (api: Hono<ApiEnv>) =>
  api.post(
    '/purchases', //
    zValidator('json', input),
    async c => {
      const { sessionId, value } = c.req.valid('json')
      const appId = c.var.appId

      const attribution = await prisma.attribution.findFirst({
        where: {
          deviceId: c.var.deviceId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          linkId: true,
        },
      })

      await prisma.purchase.create({
        data: {
          value,
          sessionId,
          linkId: attribution?.linkId,
          deviceId: c.var.deviceId,
          appId,
        },
      })

      if (attribution) {
        waitUntil(incrementRevenue(attribution.linkId, value))
      }

      return new Response()
    },
  )

const incrementRevenue = async (linkId: string, value: number) => {
  await prisma.link.update({
    where: {
      id: linkId,
    },
    data: {
      revenueCount: {
        increment: value,
      },
    },
  })
}
