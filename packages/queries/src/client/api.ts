import { Hono } from 'hono'

import { authMiddleware, AuthMiddlewareEnv } from './auth-middleware'
import { getAppAnalytics } from './routes/get-app-analytics'
import { getAppDefaultValues } from './routes/get-app-default-values'
import { getAppDomains } from './routes/get-app-domains'
import { getAppQrCodeLogoUrl } from './routes/get-app-qrcode-logo-url'
import { getLink } from './routes/get-link'
import { getLinksAnalytics } from './routes/get-links-analytics'

export type ApiEnv = AuthMiddlewareEnv

export const api = new Hono<ApiEnv>({
  strict: false,
}).basePath('/api')

api.use(authMiddleware)

getAppAnalytics(api)
getAppDefaultValues(api)
getAppDomains(api)
getAppQrCodeLogoUrl(api)
getLink(api)
getLinksAnalytics(api)
