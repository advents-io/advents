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

      await prisma.purchaseEvent.create({
        data: {
          value,
          sessionId,
        },
      })

      return new Response()
    },
  )
