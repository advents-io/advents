import { Hono } from 'hono'

import { prisma } from '@/lib/prisma'

export const logEvent = (api: Hono) =>
  api.post('/', async c => {
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

    await prisma.event.create({
      data: {
        data: body,
      },
    })

    return new Response()
  })
