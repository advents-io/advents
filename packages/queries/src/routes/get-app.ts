import { prisma } from '@advents/db'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import { ApiEnv } from '../api'

const inputSchema = z.object({
  teamSlug: z.string({ message: 'Slug da equipe é obrigatório.' }),
  appSlug: z.string({ message: 'Slug do app é obrigatório.' }),
})

export type GetAppInput = z.infer<typeof inputSchema>

const outputSchema = z.object({
  name: z.string(),
  slug: z.string(),
  defaultDomain: z.string(),
  androidUrl: z.string().url(),
  iosUrl: z.string().url(),
  defaultFallbackUrl: z.string().url().nullable(),
  imageUrl: z.string().url(),
  qrcodeLogoUrl: z.string().url().nullable(),
})

export type GetAppOutput = z.infer<typeof outputSchema>

export const getApp = (api: Hono<ApiEnv>) =>
  api.get(
    '/app', //
    zValidator('query', inputSchema),
    async c => {
      const { appSlug, teamSlug } = c.req.valid('query')

      const app = await prisma.app.findFirst({
        where: {
          slug: appSlug,
          team: {
            slug: teamSlug,
            members: {
              some: {
                userId: c.var.user.id,
              },
            },
          },
        },
        select: {
          name: true,
          slug: true,
          defaultDomain: true,
          imageUrl: true,
          androidUrl: true,
          iosUrl: true,
          defaultFallbackUrl: true,
          qrcodeLogoUrl: true,
        },
      })

      if (!app) {
        return c.json({ error: 'App não encontrado.' }, 404)
      }

      const response = outputSchema.parse(app)

      return c.json(response)
    },
  )
