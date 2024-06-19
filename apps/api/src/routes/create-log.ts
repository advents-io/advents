import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { PrismaJson, prisma } from '@/libs/prisma'

const bodySchema = z.object({
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

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/logs',
    {
      schema: {
        body: bodySchema,
      },
    },
    async (request, reply) => {
      try {
        await prisma.log.create({
          data: {
            ...request.body,
            installTime: request.body.installTime ? new Date(request.body.installTime) : null,
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
