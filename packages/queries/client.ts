export { api } from './src/client/api'
export { handle } from 'hono/vercel'

//

export type {
  GetAppAnalyticsInput,
  GetAppAnalyticsOutput,
} from './src/client/routes/get-app-analytics'
export type {
  GetAppDefaultValuesInput,
  GetAppDefaultValuesOutput,
} from './src/client/routes/get-app-default-values'
export type { GetAppDomainsInput, GetAppDomainsOutput } from './src/client/routes/get-app-domains'
export type {
  GetAppQrCodeUrlInput,
  GetAppQrCodeUrlOutput,
} from './src/client/routes/get-app-qrcode-url'
export type { GetLinkInput, GetLinkOutput } from './src/client/routes/get-link'
export type {
  GetLinksAnalyticsInput,
  GetLinksAnalyticsOutput,
} from './src/client/routes/get-links-analytics'
