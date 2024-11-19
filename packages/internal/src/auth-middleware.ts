import { supabaseServer } from '@advents/supabase/server'
import { createMiddleware } from 'hono/factory'

export type AuthMiddlewareEnv = {
  Variables: {
    user: {
      id: string
    }
  }
}

export const authMiddleware = createMiddleware<AuthMiddlewareEnv>(async (c, next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ message: 'Unauthorized.' }, 401)
  }

  const jwt = authHeader.slice(7)

  const supabase = await supabaseServer()

  const {
    data: { user },
  } = await supabase.auth.getUser(jwt)

  if (!user) {
    return c.json({ message: 'Unauthorized.' }, 401)
  }

  await next()
})
