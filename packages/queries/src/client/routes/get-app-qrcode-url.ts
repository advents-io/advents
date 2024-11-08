import { prisma } from '@advents/db'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import { ApiEnv } from '../api'

const inputSchema = z.object({
  appSlug: z.string({ message: 'Slug do app é obrigatório.' }),
  teamSlug: z.string({ message: 'Slug da equipe é obrigatório.' }),
})

export type GetAppQrCodeUrlInput = z.infer<typeof inputSchema>

const outputSchema = z.object({
  url: z.string().nullable(),
})

export type GetAppQrCodeUrlOutput = z.infer<typeof outputSchema>

export const getAppQrCodeUrl = (api: Hono<ApiEnv>) =>
  api.get(
    '/app/qrcode', //
    zValidator('query', inputSchema),
    async c => {
      const { appSlug, teamSlug } = c.req.valid('query')

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
          qrcodeLogoUrl: true,
        },
      })

      if (!app) {
        return c.json({ error: 'App não encontrado.' }, 404)
      }

      const response = outputSchema.parse({ url: app?.qrcodeLogoUrl || null })

      return c.json(response)
    },
  )
