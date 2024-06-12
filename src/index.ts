import fastify from 'fastify'

const app = fastify()

app.get('/', (_, reply) => reply.send({ hello: 'world' }))

const port = Number(process.env.PORT) || 3000
const host = 'RENDER' in process.env ? `0.0.0.0` : `localhost`

app.listen({ port, host }).then(() => console.log('Server is running'))
