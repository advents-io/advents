import { handle } from 'hono/vercel'

import { api } from './src/api'
import { clickMiddleware, isLinkDomain } from './src/click/middleware'

export { api, clickMiddleware, handle, isLinkDomain }
