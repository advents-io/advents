import { Hono } from 'hono'

import { authMiddleware, AuthMiddlewareEnv } from './auth-middleware'
import { getAppAnalytics } from './routes/analytics/get-app-analytics'
import { getLinksAnalytics } from './routes/analytics/get-links-analytics'
import { getAppQrCodeUrl } from './routes/app/get-app-qrcode-url'

export type ApiEnv = AuthMiddlewareEnv

export const api = new Hono<ApiEnv>({
  strict: false,
}).basePath('/api')

api.use(authMiddleware)

getAppAnalytics(api)
getLinksAnalytics(api)
getAppQrCodeUrl(api)
