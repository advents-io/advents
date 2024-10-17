import { handle } from 'hono/vercel'

import { api } from './src/api'
import { query } from './src/query'

export { api, handle, query }
