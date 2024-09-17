import { Hono } from 'hono'

import { authMiddleware } from '@/api/auth-middleware'
import { getApiStatus } from '@/api/routes/get-api-status'
import { logSession } from '@/api/routes/log-session'

export const api = new Hono({
  strict: false,
}).basePath('/api/events')

api.use(authMiddleware)

getApiStatus(api)
logSession(api)
