import { Hono } from 'hono'

export const getApiStatus = (api: Hono) =>
  api.get('/status', c => {
    return c.json({
      message: 'Advents events API is working 🚀',
    })
  })
