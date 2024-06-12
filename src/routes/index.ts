import { FastifyInstance } from 'fastify'

export async function checkServerStatus(app: FastifyInstance) {
  app.get('/', (_, reply) => {
    reply.send({
      status: 'Server is running!',
    })
  })
}
