export { api } from './src/client/api'
export { handle } from 'hono/vercel'

//

export type { GetAppInput, GetAppOutput } from './src/client/routes/get-app'
export type {
  GetAppAnalyticsInput,
  GetAppAnalyticsOutput,
} from './src/client/routes/get-app-analytics'
export type {
  GetAppDefaultValuesInput,
  GetAppDefaultValuesOutput,
} from './src/client/routes/get-app-default-values'
export type { GetAppIdInput, GetAppIdOutput } from './src/client/routes/get-app-id'
export type {
  GetAppQrCodeUrlInput,
  GetAppQrCodeUrlOutput,
} from './src/client/routes/get-app-qrcode-url'
export type { GetLinkInput, GetLinkOutput } from './src/client/routes/get-link'
export type {
  GetLinksAnalyticsInput,
  GetLinksAnalyticsOutput,
} from './src/client/routes/get-links-analytics'
