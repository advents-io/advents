import { handle } from 'hono/vercel'

import { clickMiddleware } from './src/clicks/click-middleware'
import { eventsApi } from './src/events/api'
import { isLinkDomain } from './src/utils/domain'
import { wellKnownHandlerApi } from './src/well-known-handler/api'

export { clickMiddleware, eventsApi, handle, isLinkDomain, wellKnownHandlerApi }
