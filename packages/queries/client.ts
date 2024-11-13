export { api } from './src/client/api'
export { handle } from 'hono/vercel'

//

export type {
  GetAppAnalyticsOutput,
  GetAppAnalyticsParamsInput,
  GetAppAnalyticsQueryInput,
} from './src/client/routes/get-app-analytics'
export type {
  GetAppDefaultValuesInput,
  GetAppDefaultValuesOutput,
} from './src/client/routes/get-app-default-values'
export type { GetAppDomainsInput, GetAppDomainsOutput } from './src/client/routes/get-app-domains'
export type {
  GetAppQrCodeLogoUrlInput,
  GetAppQrCodeLogoUrlOutput,
} from './src/client/routes/get-app-qrcode-logo-url'
export type { GetLinkInput, GetLinkOutput } from './src/client/routes/get-link'
export type {
  GetLinksAnalyticsOutput,
  GetLinksAnalyticsParamsInput,
  GetLinksAnalyticsQueryInput,
} from './src/client/routes/get-links-analytics'
