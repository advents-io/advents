import { prisma } from '@advents/db'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import { authMiddleware } from '../auth-middleware'

const input = z.object({
  value: z
    .number({ message: 'Purchase value is required.' })
    .min(0, { message: 'Purchase value must be greater than 0.' }),
  sessionId: z
    .string({ message: 'Session ID is required.' })
    .uuid({ message: 'Invalid session ID.' }),
})

export const logPurchase = (api: Hono) =>
  api.post(
    '/purchases', //
    zValidator('json', input),
    authMiddleware,
    async c => {
      const { sessionId, value } = c.req.valid('json')
      const appId = c.var.appId

      const session = await prisma.session.findUnique({
        where: { id: sessionId },
        select: {
          attribution: {
            select: {
              linkId: true,
            },
          },
        },
      })

      await prisma.purchase.create({
        data: {
          value,
          sessionId,
          linkId: session?.attribution?.linkId,
          appId,
        },
      })

      return new Response()
    },
  )
