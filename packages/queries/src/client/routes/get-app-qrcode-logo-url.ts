import { prisma } from '@advents/db'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import { ApiEnv } from '../api'

const inputSchema = z.object({
  teamSlug: z.string({ message: 'Slug da equipe é obrigatório.' }),
  appSlug: z.string({ message: 'Slug do app é obrigatório.' }),
})

export type GetAppQrCodeLogoUrlInput = z.infer<typeof inputSchema>

const outputSchema = z.object({
  url: z.string().nullable(),
})

export type GetAppQrCodeLogoUrlOutput = z.infer<typeof outputSchema>

export const getAppQrCodeLogoUrl = (api: Hono<ApiEnv>) =>
  api.get(
    '/team/:teamSlug/app/:appSlug/qrcode-logo', //
    zValidator('param', inputSchema),
    async c => {
      const { teamSlug, appSlug } = c.req.valid('param')

      const userId = c.var.user.id

      const app = await prisma.app.findFirst({
        where: {
          slug: appSlug,
          team: {
            slug: teamSlug,
            members: {
              some: {
                userId,
              },
            },
          },
        },
        select: {
          qrCodeLogoUrl: true,
        },
      })

      if (!app) {
        return c.json({ error: 'App não encontrado.' }, 404)
      }

      const response = outputSchema.parse({ url: app?.qrCodeLogoUrl || null })

      return c.json(response)
    },
  )
