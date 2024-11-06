import { Hono } from 'hono'

import { authMiddleware, AuthMiddlewareEnv } from './auth-middleware'
import { getApp } from './routes/get-app'
import { getAppAnalytics } from './routes/get-app-analytics'
import { getAppDefaultValues } from './routes/get-app-default-values'
import { getAppId } from './routes/get-app-id'
import { getAppQrCodeUrl } from './routes/get-app-qrcode-url'
import { getLink } from './routes/get-link'
import { getLinksAnalytics } from './routes/get-links-analytics'

export type ApiEnv = AuthMiddlewareEnv

export const api = new Hono<ApiEnv>({
  strict: false,
}).basePath('/api')

api.use(authMiddleware)

getAppAnalytics(api)
getAppDefaultValues(api)
getAppId(api)
getAppQrCodeUrl(api)
getApp(api)
getLink(api)
getLinksAnalytics(api)
