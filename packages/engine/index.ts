import { handle } from 'hono/vercel'

import { api } from './src/api'
import { isLinkDomain, linkMiddleware } from './src/link-middleware'

export { api, handle, isLinkDomain, linkMiddleware }
