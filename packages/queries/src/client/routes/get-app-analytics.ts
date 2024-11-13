import { dayjs } from '@advents/common'
import { prisma } from '@advents/db'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import { ApiEnv } from '../api'

const inputParamsSchema = z.object({
  appSlug: z.string({ message: 'Slug do app é obrigatório.' }),
  teamSlug: z.string({ message: 'Slug da equipe é obrigatório.' }),
})

const inputQuerySchema = z.object({
  startDate: z
    .string({ message: 'Data de início é obrigatória.' })
    .transform(date => new Date(date)),
  endDate: z.string({ message: 'Data de fim é obrigatória.' }).transform(date => new Date(date)),
})

export type GetAppAnalyticsParamsInput = z.infer<typeof inputParamsSchema>
export type GetAppAnalyticsQueryInput = z.infer<typeof inputQuerySchema>

const outputSchema = z.object({
  clicks: z.number(),
  clicksIncrease: z.number(),
  installs: z.number(),
  installsIncrease: z.number(),
  cti: z.number(),
  ctiIncrease: z.number(),
  revenue: z.number(),
  revenueIncrease: z.number(),
  lastPeriodStartDate: z.date(),
  lastPeriodEndDate: z.date(),
})

export type GetAppAnalyticsOutput = z.infer<typeof outputSchema>

export const getAppAnalytics = (api: Hono<ApiEnv>) =>
  api.get(
    ':teamSlug/:appSlug/analytics', //
    zValidator('param', inputParamsSchema),
    zValidator('query', inputQuerySchema),
    async c => {
      const { startDate, endDate } = c.req.valid('query')
      const { appSlug, teamSlug } = c.req.valid('param')

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

      const range = endDate.getTime() - startDate.getTime()

      const lastPeriodStartDate = new Date(startDate.getTime() - range)
      const lastPeriodEndDate = new Date(endDate.getTime() - range)

      const [
        clicks,
        lastPeriodClicks,
        installs,
        lastPeriodInstalls,
        revenueSum,
        lastPeriodRevenueSum,
      ] = await prisma.$transaction([
        prisma.click.count({
          where: {
            app: {
              slug: appSlug,
              team: {
                slug: teamSlug,
              },
            },
            createdAt: {
              gte: dayjs(startDate).utc().startOf('day').toDate(),
              lte: dayjs(endDate).utc().endOf('day').toDate(),
            },
          },
        }),

        prisma.click.count({
          where: {
            app: {
              slug: appSlug,
              team: {
                slug: teamSlug,
              },
            },
            createdAt: {
              gte: dayjs(lastPeriodStartDate).utc().startOf('day').toDate(),
              lte: dayjs(lastPeriodEndDate).utc().endOf('day').toDate(),
            },
          },
        }),

        prisma.attribution.count({
          where: {
            app: {
              slug: appSlug,
              team: {
                slug: teamSlug,
              },
            },
            createdAt: {
              gte: dayjs(startDate).utc().startOf('day').toDate(),
              lte: dayjs(endDate).utc().endOf('day').toDate(),
            },
          },
        }),

        prisma.attribution.count({
          where: {
            app: {
              slug: appSlug,
              team: {
                slug: teamSlug,
              },
            },
            createdAt: {
              gte: dayjs(lastPeriodStartDate).utc().startOf('day').toDate(),
              lte: dayjs(lastPeriodEndDate).utc().endOf('day').toDate(),
            },
          },
        }),

        prisma.purchase.aggregate({
          _sum: {
            value: true,
          },
          where: {
            app: {
              slug: appSlug,
              team: {
                slug: teamSlug,
              },
            },
            createdAt: {
              gte: dayjs(startDate).utc().startOf('day').toDate(),
              lte: dayjs(endDate).utc().endOf('day').toDate(),
            },
          },
        }),

        prisma.purchase.aggregate({
          _sum: {
            value: true,
          },
          where: {
            app: {
              slug: appSlug,
              team: {
                slug: teamSlug,
              },
            },
            createdAt: {
              gte: dayjs(lastPeriodStartDate).utc().startOf('day').toDate(),
              lte: dayjs(lastPeriodEndDate).utc().endOf('day').toDate(),
            },
          },
        }),
      ])

      const clicksIncrease = calculateIncrease(clicks, lastPeriodClicks)
      const installsIncrease = calculateIncrease(installs, lastPeriodInstalls)

      const cti = clicks > 0 ? (installs / clicks) * 100 : 0
      const lastPeriodCti = lastPeriodClicks > 0 ? (lastPeriodInstalls / lastPeriodClicks) * 100 : 0

      const ctiIncrease = calculateIncrease(cti, lastPeriodCti)

      const revenue = revenueSum._sum.value || 0
      const lastPeriodRevenue = lastPeriodRevenueSum._sum.value || 0

      const revenueIncrease = calculateIncrease(revenue, lastPeriodRevenue)

      const response = outputSchema.parse({
        clicks,
        clicksIncrease,
        installs,
        installsIncrease,
        cti,
        ctiIncrease,
        revenue,
        revenueIncrease,
        lastPeriodStartDate,
        lastPeriodEndDate,
      })

      return c.json(response)
    },
  )

const calculateIncrease = (current: number, lastPeriod: number): number => {
  if (lastPeriod === 0) {
    return current > 0 ? 100 : 0
  }

  return ((current - lastPeriod) / lastPeriod) * 100
}
