import { supabaseClient } from '@advents/supabase'
import { createMiddleware } from 'hono/factory'

export const authMiddleware = createMiddleware(async (c, next) => {
  const user = await supabaseClient().auth.getUser()

  if (user.error) {
    return c.json({ message: 'Unauthorized.' }, 401)
  }

  await next()
})
