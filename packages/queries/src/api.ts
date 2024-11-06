import { Hono } from 'hono'

import { authMiddleware, AuthMiddlewareEnv } from './auth-middleware'
import { getAppAnalytics } from './routes/get-app-analytics'
import { getAppQrCodeUrl } from './routes/get-app-qrcode-url'
import { getLinksAnalytics } from './routes/get-links-analytics'

export type ApiEnv = AuthMiddlewareEnv

export const api = new Hono<ApiEnv>({
  strict: false,
}).basePath('/api')

api.use(authMiddleware)

getAppAnalytics(api)
getLinksAnalytics(api)
getAppQrCodeUrl(api)
