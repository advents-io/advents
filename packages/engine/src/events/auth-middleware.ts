import { prisma } from '@advents/db'
import { createMiddleware } from 'hono/factory'

export type AuthMiddlewareEnv = {
  Variables: {
    appId: string
  }
}

export const authMiddleware = createMiddleware<AuthMiddlewareEnv>(async (c, next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ message: 'Unauthorized.' }, 401)
  }

  const key = authHeader.slice(7)

  // Key length must be 32: advents_[24 chars token here]
  if (key.length !== 32) {
    return c.json({ message: 'Unauthorized.' }, 401)
  }

  const apiKey = await prisma.apiKey.findUnique({
    where: {
      key,
    },
    select: {
      id: true,
      appId: true,
    },
  })

  if (!apiKey) {
    return c.json({ message: 'Unauthorized.' }, 401)
  }

  c.set('appId', apiKey.appId)

  await next()
})
