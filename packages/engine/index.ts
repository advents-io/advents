import { handle } from 'hono/vercel'

import { clickMiddleware, isLinkDomain } from './src/clicks/click-middleware'
import { api } from './src/events/api'

export { api, clickMiddleware, handle, isLinkDomain }
