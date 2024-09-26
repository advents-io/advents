import { Hono } from 'hono'

import { getApiStatus } from '@/routes/get-api-status'
import { logSession } from '@/routes/log-session'

export const api = new Hono({
  strict: false,
}).basePath('/api/events')

getApiStatus(api)
logSession(api)
