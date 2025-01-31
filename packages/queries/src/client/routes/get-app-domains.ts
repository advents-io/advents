import { prisma } from '@advents/db'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import { domainSchema, getAppDomains as handleGetAppDomains } from '../../server/domains'
import { ApiEnv } from '../api'

const inputSchema = z.object({
  teamSlug: z.string({ message: 'Slug da equipe é obrigatório.' }),
  appSlug: z.string({ message: 'Slug do app é obrigatório.' }),
})

export type GetAppDomainsInput = z.infer<typeof inputSchema>

const outputSchema = z.object({
  domains: z.array(domainSchema),
})

export type GetAppDomainsOutput = z.infer<typeof outputSchema>

export const getAppDomains = (api: Hono<ApiEnv>) =>
  api.get(
    '/team/:teamSlug/app/:appSlug/domains', //
    zValidator('param', inputSchema),
    async c => {
      const { teamSlug, appSlug } = c.req.valid('param')

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
      })

      if (!app) {
        return c.json({ error: 'App não encontrado.' }, 404)
      }

      const domains = await handleGetAppDomains(app.id)

      const response = outputSchema.parse({ domains })

      return c.json(response)
    },
  )
