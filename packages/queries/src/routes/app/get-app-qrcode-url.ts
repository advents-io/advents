import { prisma } from '@advents/db'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import { authMiddleware } from '../../auth-middleware'

const getAppQrCodeUrlInputSchema = z.object({
  appSlug: z.string({ message: 'Slug do app é obrigatório.' }),
  teamSlug: z.string({ message: 'Slug da equipe é obrigatório.' }),
})

const getAppQrCodeUrlOutputSchema = z.object({
  url: z.string().nullable(),
})

export type GetAppQrCodeUrlOutput = z.infer<typeof getAppQrCodeUrlOutputSchema>

export const getAppQrCodeUrl = (api: Hono) =>
  api.get(
    '/app/qrcode', //
    zValidator('query', getAppQrCodeUrlInputSchema),
    authMiddleware,
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

      const response = getAppQrCodeUrlOutputSchema.parse({ url: app?.qrcodeLogoUrl || null })

      return c.json(response)
    },
  )
