import { FastifyInstance } from 'fastify'

export default async function (app: FastifyInstance) {
  app.get('/', (_, reply) => {
    reply.send({
      status: 'Server is running!',
    })
  })
}
