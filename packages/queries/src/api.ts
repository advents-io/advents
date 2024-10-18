import { Hono } from 'hono'

import { getAppAnalytics } from './routes/analytics/get-app-analytics'
import { getLinksAnalytics } from './routes/analytics/get-links-analytics'
import { getAppQrCodeUrl } from './routes/app/get-app-qrcode-url'
import { getApiStatus } from './routes/get-api-status'

export const api = new Hono({
  strict: false,
}).basePath('/api')

getApiStatus(api)
getAppAnalytics(api)
getLinksAnalytics(api)
getAppQrCodeUrl(api)
