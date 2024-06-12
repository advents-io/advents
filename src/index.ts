import { fastify } from 'fastify'

const app = fastify()

app.get('/', (_, reply) => reply.send({ hello: 'world' }))

app.listen({ port: 3000 }).then(() => console.log('Server is running'))
