import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import { getAppDomains as handleGetAppDomains } from '../../server/domains'
import { ApiEnv } from '../api'

const inputSchema = z.object({
  appId: z.string({ message: 'Id do app é obrigatório.' }),
})

export type GetAppDomainsInput = z.infer<typeof inputSchema>

const outputSchema = z.object({
  domains: z.array(z.string()),
})

export type GetAppDomainsOutput = z.infer<typeof outputSchema>

export const getAppDomains = (api: Hono<ApiEnv>) =>
  api.get(
    '/app/:appId/domains', //
    zValidator('param', inputSchema),
    async c => {
      const { appId } = c.req.valid('param')

      // We should add authorization to valid if user has access to the app,
      // but previously of fetching this endpoint, we call the getAppDefaultValues,
      // which already validates if the user has access to the app.

      const domains = await handleGetAppDomains(appId)

      const response = outputSchema.parse({
        domains: domains.map(domain => domain.domain),
      })

      return c.json(response)
    },
  )
