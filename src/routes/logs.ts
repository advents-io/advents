import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { PrismaJson, prisma } from '@/lib/prisma'

const insertLogSchema = z.object({
  comment: z.string().nullable(),
  data: z.unknown(),

  deviceId: z.string().nullable(),
  deviceName: z.string().nullable(),
  deviceBrand: z.string().nullable(),
  deviceModel: z.string().nullable(),
  deviceYearClass: z.string().nullable(),
  osName: z.string().nullable(),
  osVersion: z.string().nullable(),
  installTime: z.string().nullable(),
  installReferrer: z.string().nullable(),
  appVersion: z.string().nullable(),
})

export async function insertLog(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/logs',
    {
      schema: {
        body: insertLogSchema,
      },
    },
    async (request, reply) => {
      try {
        await prisma.log.create({
          data: {
            ...request.body,
            data: request.body.data as PrismaJson,
          },
        })

        reply.status(201)
      } catch (error) {
        reply.status(400)
      }
    },
  )
}
