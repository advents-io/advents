import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

const bodySchema = z.object({
  slug: z.string(),
  iosUrl: z.string().url().includes('apps.apple.com'),
  androidUrl: z.string().url().includes('play.google.com'),
  fallbackUrl: z.string().url(),
})

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/links',
    {
      schema: {
        body: bodySchema,
      },
    },
    async (request, reply) => {
      const domain = 'l.advents.io'

      await prisma.link.create({
        data: {
          domain: 'l.advents.io',
          ...request.body,
        },
      })

      const link = `${domain}/${request.body.slug}`

      reply.status(201).send({ link })
    },
  )
}
