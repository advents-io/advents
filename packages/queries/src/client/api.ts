import { Hono } from 'hono'

import { authMiddleware, AuthMiddlewareEnv } from './auth-middleware'
import { getAppAnalytics } from './routes/get-app-analytics'
import { getAppDefaultValues } from './routes/get-app-default-values'
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
getAppQrCodeUrl(api)
getLink(api)
getLinksAnalytics(api)
