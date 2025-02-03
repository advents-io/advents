import { Hono } from 'hono'

import { authMiddleware, AuthMiddlewareEnv } from './auth-middleware'
import { deviceMiddleware, DeviceMiddlewareEnv } from './device-middleware'
import { logPurchase } from './routes/log-purchase'
import { logSession } from './routes/log-session'

export type ApiEnv = AuthMiddlewareEnv & DeviceMiddlewareEnv

export const eventsApi = new Hono<ApiEnv>({
  strict: false,
}).basePath('/api/events')

eventsApi.use(authMiddleware)
eventsApi.use(deviceMiddleware)

logSession(eventsApi)
logPurchase(eventsApi)
