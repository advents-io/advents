import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'

import { registerRoutes } from '@/configs/register-routes'
import { isDevelopment } from '@/utils/environment'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)
app.register(fastifyCors)

app.register(registerRoutes)

if (isDevelopment) {
  app.addHook('onRequest', (request, _, done) => {
    console.log(`${request.method} ${request.url}`)
    done()
  })
}

const port = Number(process.env.PORT) || 3000
const host = 'RENDER' in process.env ? '0.0.0.0' : 'localhost'

app.listen({ port, host }).then(() => console.log('Server is running!'))
