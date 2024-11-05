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

      const app = await prisma.app.findFirst({
        where: {
          slug: appSlug,
          team: {
            slug: teamSlug,
          },
        },
        select: {
          qrcodeLogoUrl: true,
        },
      })

      return c.json(getAppQrCodeUrlOutputSchema.parse({ url: app?.qrcodeLogoUrl || null }))
    },
  )
