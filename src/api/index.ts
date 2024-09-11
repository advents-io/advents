import { Hono } from 'hono'

import { getApiStatus } from '@/api/routes/get-api-status'

export const api = new Hono({
  strict: false,
}).basePath('/api')

getApiStatus(api)
