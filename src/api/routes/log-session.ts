import { Hono } from 'hono'

export const logSession = (api: Hono) =>
  api.post('/session', async c => {
    const body = await c.req.json()

    console.log(body)

    return c.json({
      message: 'Success',
    })
  })
