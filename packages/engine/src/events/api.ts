import { Hono } from 'hono'

import { authMiddleware, AuthMiddlewareEnv } from './auth-middleware'
import { logPurchase } from './routes/log-purchase'
import { logSession } from './routes/log-session'

export type ApiEnv = AuthMiddlewareEnv

export const api = new Hono<ApiEnv>({
  strict: false,
}).basePath('/api/events')

api.use(authMiddleware)

logSession(api)
logPurchase(api)
