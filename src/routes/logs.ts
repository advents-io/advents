import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { PrismaJson, prisma } from '@/lib/prisma'

export async function insertLog(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/logs',
    {
      schema: {
        body: z.object({
          comment: z.string().nullable(),
          data: z.unknown(),
        }),
      },
    },
    async (request, reply) => {
      await prisma.log.create({
        data: {
          comment: request.body.comment,
          data: request.body.data as PrismaJson,
        },
      })

      reply.status(201)
    },
  )
}
