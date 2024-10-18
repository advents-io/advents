import { handle } from 'hono/vercel'

import { api } from './src/api'

export { api, handle }

export * from './src/types/analytics/get-app-analytics-types'
