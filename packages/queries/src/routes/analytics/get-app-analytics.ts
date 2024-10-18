import { dayjs } from '@advents/common'
import { prisma } from '@advents/db'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

export const getAppAnalyticsInputSchema = z.object({
  appSlug: z.string({ message: 'Slug do app é obrigatório.' }),
  startDate: z
    .string({ message: 'Data de início é obrigatória.' })
    .transform(date => new Date(date)),
  endDate: z.string({ message: 'Data de fim é obrigatória.' }).transform(date => new Date(date)),
})

export const getAppAnalyticsOutputSchema = z.object({
  clicks: z.number(),
  clicksIncrease: z.number(),
  installs: z.number(),
  installsIncrease: z.number(),
  cti: z.number(),
  ctiIncrease: z.number(),
  revenue: z.number(),
  revenueIncrease: z.number(),
})

export const getAppAnalytics = (api: Hono) =>
  api.get(
    '/analytics/app', //
    zValidator('query', getAppAnalyticsInputSchema),
    async c => {
      const { appSlug, startDate, endDate } = c.req.valid('query')

      const range = endDate.getTime() - startDate.getTime()

      const lastPeriodStartDate = new Date(startDate.getTime() - range)
      const lastPeriodEndDate = new Date(endDate.getTime() - range)

      const [clicks, lastPeriodClicks, installs, lastPeriodInstalls] = await prisma.$transaction([
        prisma.click.count({
          where: {
            link: {
              app: {
                slug: appSlug,
              },
            },
            createdAt: {
              gte: dayjs(startDate).startOf('day').toDate(),
              lte: dayjs(endDate).endOf('day').toDate(),
            },
          },
        }),

        prisma.click.count({
          where: {
            link: {
              app: {
                slug: appSlug,
              },
            },
            createdAt: {
              gte: dayjs(lastPeriodStartDate).startOf('day').toDate(),
              lte: dayjs(lastPeriodEndDate).endOf('day').toDate(),
            },
          },
        }),

        prisma.attribution.count({
          where: {
            session: {
              app: {
                slug: appSlug,
              },
            },
            createdAt: {
              gte: dayjs(startDate).startOf('day').toDate(),
              lte: dayjs(endDate).endOf('day').toDate(),
            },
          },
        }),

        prisma.attribution.count({
          where: {
            session: {
              app: {
                slug: appSlug,
              },
            },
            createdAt: {
              gte: dayjs(lastPeriodStartDate).startOf('day').toDate(),
              lte: dayjs(lastPeriodEndDate).endOf('day').toDate(),
            },
          },
        }),
      ])

      const clicksIncrease = calculateIncrease(clicks, lastPeriodClicks)
      const installsIncrease = calculateIncrease(installs, lastPeriodInstalls)

      const cti = clicks > 0 ? (installs / clicks) * 100 : 0
      const lastPeriodCti = lastPeriodClicks > 0 ? (lastPeriodInstalls / lastPeriodClicks) * 100 : 0

      const ctiIncrease = calculateIncrease(cti, lastPeriodCti)

      return c.json(
        getAppAnalyticsOutputSchema.parse({
          clicks,
          clicksIncrease,
          installs,
          installsIncrease,
          cti,
          ctiIncrease,
          revenue: 0, // TODO: implement revenue
          revenueIncrease: 0, // TODO: implement revenue
        }),
      )
    },
  )

const calculateIncrease = (current: number, lastPeriod: number): number => {
  if (lastPeriod === 0) {
    return current > 0 ? 100 : 0
  }

  return ((current - lastPeriod) / lastPeriod) * 100
}
