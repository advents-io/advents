import { Hono } from 'hono'

import { getApiStatus } from '@/api/routes/get-api-status'
import { logSession } from '@/api/routes/log-session'

export const api = new Hono({
  strict: false,
}).basePath('/api/events')

getApiStatus(api)
logSession(api)
