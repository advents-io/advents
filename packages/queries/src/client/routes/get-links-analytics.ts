import { dayjs } from '@advents/common'
import { prisma } from '@advents/db'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import { ApiEnv } from '../api'

const inputParamSchema = z.object({
  teamSlug: z.string({ message: 'Slug da equipe é obrigatório.' }),
  appSlug: z.string({ message: 'Slug do app é obrigatório.' }),
})

const inputQuerySchema = z.object({
  startDate: z
    .string({ message: 'Data de início é obrigatória.' })
    .transform(date => new Date(date)),
  endDate: z.string({ message: 'Data de fim é obrigatória.' }).transform(date => new Date(date)),
})

export type GetLinksAnalyticsParamsInput = z.infer<typeof inputParamSchema>
export type GetLinksAnalyticsQueryInput = z.infer<typeof inputQuerySchema>

const outputSchema = z.array(
  z.object({
    id: z.string().uuid(),
    slug: z.string(),
    domain: z.string(),
    title: z.string().nullable(),
    clicks: z.number(),
    installs: z.number(),
    campaignCost: z.number().nullable(),
    revenue: z.number(),
    createdAt: z.date(),
  }),
)

export type GetLinksAnalyticsOutput = z.infer<typeof outputSchema>

export const getLinksAnalytics = (api: Hono<ApiEnv>) =>
  api.get(
    '/team/:teamSlug/app/:appSlug/links/analytics', //
    zValidator('param', inputParamSchema),
    zValidator('query', inputQuerySchema),
    async c => {
      const { startDate, endDate } = c.req.valid('query')
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
          id: true,
        },
      })

      if (!app) {
        return c.json({ error: 'App não encontrado.' }, 404)
      }

      const gte = dayjs(startDate).utc().startOf('day').toDate()
      const lte = dayjs(endDate).utc().endOf('day').toDate()

      const links = await prisma.link.findMany({
        where: {
          appId: app.id,
          clicks: {
            some: {
              createdAt: {
                gte,
                lte,
              },
            },
          },
        },
        select: {
          id: true,
          slug: true,
          domain: true,
          title: true,
          campaignCost: true,
          createdAt: true,
          _count: {
            select: {
              clicks: {
                where: {
                  createdAt: {
                    gte,
                    lte,
                  },
                },
              },
              attributions: {
                where: {
                  createdAt: {
                    gte,
                    lte,
                  },
                },
              },
            },
          },
          purchases: {
            select: {
              value: true,
            },
            where: {
              createdAt: {
                gte,
                lte,
              },
            },
          },
        },
      })

      const result = links.map(link => ({
        id: link.id,
        slug: link.slug,
        domain: link.domain,
        title: link.title,
        clicks: link._count.clicks,
        installs: link._count.attributions,
        campaignCost: link.campaignCost,
        revenue: link.purchases.reduce((acc, purchase) => acc + purchase.value, 0),
        createdAt: link.createdAt,
      }))

      const output = outputSchema.parse(result)

      return c.json(output)
    },
  )
