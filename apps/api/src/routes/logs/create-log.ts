import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma, PrismaJson } from '@/lib/prisma'

const bodySchema = z.object({
  comment: z.string().nullish(),
  data: z.unknown(),

  deviceId: z.string().nullish(),
  deviceName: z.string().nullish(),
  deviceBrand: z.string().nullish(),
  deviceModel: z.string().nullish(),
  deviceYearClass: z.string().nullish(),
  osName: z.string().nullish(),
  osVersion: z.string().nullish(),
  installTime: z.string().nullish(),
  installReferrer: z.string().nullish(),
  appVersion: z.string().nullish(),
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
        reply.status(400) // TODO criar validação de erros
      }
    },
  )
}
