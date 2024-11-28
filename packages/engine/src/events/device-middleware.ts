import { createMiddleware } from 'hono/factory'

export type DeviceMiddlewareEnv = {
  Variables: {
    deviceId: string
  }
}

export const deviceMiddleware = createMiddleware<DeviceMiddlewareEnv>(async (c, next) => {
  const deviceId = c.req.header('Advents-Device-Id')

  if (!deviceId) {
    return c.json({ message: 'Advents-Device-Id header is required.' }, 400)
  }

  c.set('deviceId', deviceId)

  await next()
})
