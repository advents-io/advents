import { Hono } from 'hono'

import { prisma } from '@/lib/prisma'

export const logSession = (api: Hono) =>
  api.post('/session', async c => {
    let body

    try {
      body = await c.req.json()
    } catch {}

    if (!body) {
      return c.json(
        {
          message: 'Session data is required.',
        },
        400,
      )
    }

    await prisma.session.create({
      data: {
        data: body,
      },
    })

    return new Response()
  })
