import { Hono } from 'hono'

import { getApiStatus } from './routes/get-api-status'

export const api = new Hono({
  strict: false,
}).basePath('/api')

getApiStatus(api)
