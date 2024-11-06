import { handle } from 'hono/vercel'

import { api } from './src/api'

export { api, handle }

export { type GetAppAnalyticsOutput } from './src/routes/get-app-analytics'
export { type GetAppQrCodeUrlOutput } from './src/routes/get-app-qrcode-url'
export { type GetLinksAnalyticsOutput } from './src/routes/get-links-analytics'
