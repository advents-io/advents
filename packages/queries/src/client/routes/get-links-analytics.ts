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

      const clicks = await prisma.click.findMany({
        select: {
          link: {
            select: {
              id: true,
              slug: true,
              domain: true,
              title: true,
              campaignCost: true,
              createdAt: true,
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
          },
          attribution: {
            select: {
              id: true,
            },
          },
        },
        where: {
          appId: app.id,
          createdAt: {
            gte,
            lte,
          },
        },
      })

      const links = Object.values(
        clicks.reduce(
          (acc, click) => {
            const { id } = click.link

            if (!acc[id]) {
              const revenue = click.link.purchases.reduce(
                (acc, purchase) => acc + purchase.value,
                0,
              )

              acc[id] = {
                id,
                slug: click.link.slug,
                domain: click.link.domain,
                title: click.link.title,
                clicks: 0,
                installs: 0,
                campaignCost: click.link.campaignCost,
                revenue,
                createdAt: click.link.createdAt,
              }
            }

            acc[id].clicks++

            if (click.attribution) {
              acc[id].installs++
            }

            return acc
          },
          {} as Record<
            string,
            {
              id: string
              slug: string
              domain: string
              title: string | null
              clicks: number
              installs: number
              campaignCost: number | null
              revenue: number
              createdAt: Date
            }
          >,
        ),
      )

      const result = outputSchema.parse(links)

      return c.json(result)
    },
  )
