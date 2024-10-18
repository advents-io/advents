import { handle } from 'hono/vercel'

import { api } from './src/api'

export { api, handle }

export { type GetAppAnalyticsOutput } from './src/routes/analytics/get-app-analytics'
export { type GetLinksAnalyticsOutput } from './src/routes/analytics/get-links-analytics'
export { type GetAppQrCodeUrlOutput } from './src/routes/app/get-app-qrcode-url'
