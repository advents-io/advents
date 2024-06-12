import fastify from 'fastify'
import fastifyCors from '@fastify/cors'

const app = fastify()

app.register(fastifyCors)


const port = Number(process.env.PORT) || 3000
const host = 'RENDER' in process.env ? `0.0.0.0` : `localhost`

app.listen({ port, host }).then(() => console.log('Server is running!'))
