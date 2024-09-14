import { Hono } from 'hono'

import { authMiddleware } from '@/api/auth-middleware'
import { getApiStatus } from '@/api/routes/get-api-status'

export const api = new Hono({
  strict: false,
}).basePath('/api/events')

api.use(authMiddleware)

getApiStatus(api)
