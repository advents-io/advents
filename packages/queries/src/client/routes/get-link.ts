import { prisma } from '@advents/db'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import { ApiEnv } from '../api'

const inputSchema = z.object({
  linkId: z
    .string({ message: 'Id do link em formato inválido.' })
    .uuid('Id do link em formato inválido.'),
})

export type GetLinkInput = z.infer<typeof inputSchema>

const outputSchema = z.object({
  id: z.string().uuid(),
  title: z.string().nullable(),
  domain: z.string(),
  slug: z.string(),
  androidUrl: z.string().url().nullable(),
  iosUrl: z.string().url().nullable(),
  disableIosPreviewPage: z.boolean().nullable(),
  fallbackUrl: z.string().url().nullable(),
  campaignCost: z.number().nullable(),
})

export type GetLinkOutput = z.infer<typeof outputSchema>

export const getLink = (api: Hono<ApiEnv>) =>
  api.get(
    '/link/:linkId', //
    zValidator('param', inputSchema),
    async c => {
      const { linkId } = c.req.valid('param')

      const link = await prisma.link.findUnique({
        where: {
          id: linkId,
          app: {
            team: {
              members: {
                some: {
                  userId: c.var.user.id,
                },
              },
            },
          },
        },
        select: {
          id: true,
          title: true,
          domain: true,
          slug: true,
          androidUrl: true,
          iosUrl: true,
          disableIosPreviewPage: true,
          fallbackUrl: true,
          campaignCost: true,
        },
      })

      if (!link) {
        return c.json({ error: 'Link não encontrado' }, 404)
      }

      const response = outputSchema.parse(link)

      return c.json(response)
    },
  )
