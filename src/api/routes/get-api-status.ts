import { Hono } from 'hono'

export const getApiStatus = (api: Hono) =>
  api.get('/status', handler => {
    return handler.json({
      message: 'Advents API is working 🚀',
    })
  })
