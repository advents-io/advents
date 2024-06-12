import { FastifyInstance } from 'fastify'
import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'

export async function insertLog(app: FastifyInstance) {
  app.post('/logs', async (request, reply) => {
    await prisma.log.create({
      data: {
        log: request.body as Prisma.InputJsonValue,
      },
    })

    reply.status(201)
  })
}
