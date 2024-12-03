import { discord } from '@advents/common'
import { prisma } from '@advents/db'
import { zValidator } from '@hono/zod-validator'
import { waitUntil } from '@vercel/functions'
import { Hono } from 'hono'
import { z } from 'zod'

import { ApiEnv } from '../api'

const input = z.object({
  value: z
    .number({ message: 'Purchase value is required.' })
    .min(0, { message: 'Purchase value must be greater than 0.' }),
  sessionId: z
    .string({ message: 'Session ID is required.' })
    .uuid({ message: 'Invalid session ID.' }),
})

export const logPurchase = (api: Hono<ApiEnv>) =>
  api.post(
    '/purchases', //
    zValidator('json', input),
    async c => {
      try {
        const { sessionId, value } = c.req.valid('json')
        const appId = c.var.appId

        const install = await prisma.install.findFirst({
          where: {
            deviceId: c.var.deviceId,
          },
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            attribution: {
              select: {
                linkId: true,
              },
            },
          },
        })

        if (!install) {
          await discord.sendErrorLog({
            description:
              'Erro no `logPurchase`. Instalação não encontrada para criação do purchase.',
            error: 'Install not found..',
          })

          return c.json({ error: 'Install not found.' }, 404)
        }

        await prisma.purchase.create({
          data: {
            value,
            sessionId,
            linkId: install?.attribution?.linkId,
            deviceId: c.var.deviceId,
            installId: install.id,
            appId,
          },
        })

        if (install.attribution) {
          waitUntil(incrementRevenue(install.attribution.linkId, value))
        }

        return new Response()
      } catch (error) {
        await discord.sendErrorLog({
          description: 'Erro no `logPurchase`',
          error,
        })

        throw error
      }
    },
  )

const incrementRevenue = async (linkId: string, value: number) => {
  try {
    await prisma.link.update({
      where: {
        id: linkId,
      },
      data: {
        revenueCount: {
          increment: value,
        },
      },
    })
  } catch (error) {
    await discord.sendErrorLog({
      description: 'Erro no `incrementRevenue`',
      error,
    })
  }
}
