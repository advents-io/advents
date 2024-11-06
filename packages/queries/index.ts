import { handle } from 'hono/vercel'

import { api } from './src/api'

export { api, handle }

export type { GetAppInput, GetAppOutput } from './src/routes/get-app'
export type { GetAppAnalyticsInput, GetAppAnalyticsOutput } from './src/routes/get-app-analytics'
export type {
  GetAppDefaultValuesInput,
  GetAppDefaultValuesOutput,
} from './src/routes/get-app-default-values'
export type { GetAppIdInput, GetAppIdOutput } from './src/routes/get-app-id'
export type { GetAppQrCodeUrlInput, GetAppQrCodeUrlOutput } from './src/routes/get-app-qrcode-url'
export type { GetLinkInput, GetLinkOutput } from './src/routes/get-link'
export type {
  GetLinksAnalyticsInput,
  GetLinksAnalyticsOutput,
} from './src/routes/get-links-analytics'
