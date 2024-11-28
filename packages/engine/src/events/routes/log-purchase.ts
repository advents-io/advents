import { prisma } from '@advents/db'
import { zValidator } from '@hono/zod-validator'
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

      // TODO: this is only attributing when the purchase is made in the first session.
      const session = await prisma.session.findUnique({
        where: {
          id: sessionId,
        },
        select: {
          attribution: {
            select: {
              linkId: true,
            },
          },
        },
      })

      const createPurchaseQuery = prisma.purchase.create({
        data: {
          value,
          sessionId,
          linkId: session?.attribution?.linkId,
          appId,
        },
      })

      // Smell alert: sorry, I not found a better way to do this.
      if (session?.attribution?.linkId) {
        await prisma.$transaction([
          createPurchaseQuery,

          prisma.link.update({
            where: {
              id: session?.attribution?.linkId,
            },
            data: {
              revenueCount: {
                increment: value,
              },
            },
          }),
        ])
      } else {
        await createPurchaseQuery
      }

      return new Response()
    },
  )
