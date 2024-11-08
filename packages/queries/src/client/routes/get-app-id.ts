import { prisma } from '@advents/db'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import { ApiEnv } from '../api'

const inputSchema = z.object({
  teamSlug: z.string({ message: 'Slug da equipe é obrigatório.' }),
  appSlug: z.string({ message: 'Slug do app é obrigatório.' }),
})

export type GetAppIdInput = z.infer<typeof inputSchema>

const outputSchema = z.object({
  id: z.string(),
})

export type GetAppIdOutput = z.infer<typeof outputSchema>

export const getAppId = (api: Hono<ApiEnv>) =>
  api.get(
    '/app/id', //
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
          id: true,
        },
      })

      if (!app) {
        return c.json({ error: 'App não encontrado.' }, 404)
      }

      const response = outputSchema.parse({ id: app.id })

      return c.json(response)
    },
  )
