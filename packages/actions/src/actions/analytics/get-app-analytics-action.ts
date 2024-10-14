'use server'

import { dayjs } from '@advents/common'
import { prisma } from '@advents/db'

import { authActionClient } from '../../safe-action'
import { getAppAnalyticsInputSchema } from '../../schemas/input/analytics/get-app-analytics-input'
import { getAppAnalyticsOutputSchema } from '../../schemas/output/analytics/get-app-analytics-output'

export const getAppAnalyticsAction = authActionClient
  .schema(getAppAnalyticsInputSchema)
  .outputSchema(getAppAnalyticsOutputSchema)
  .action(async ({ parsedInput }) => {
    const { appSlug, startDate, endDate } = parsedInput

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
            gte: startDate,
            lte: endDate,
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
            gte: lastPeriodStartDate,
            lte: lastPeriodEndDate,
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
            gte: startDate,
            lte: endDate,
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
            gte: lastPeriodStartDate,
            lte: lastPeriodEndDate,
          },
        },
      }),
    ])

    const clicksIncrease = calculateIncrease(clicks, lastPeriodClicks)
    const installsIncrease = calculateIncrease(installs, lastPeriodInstalls)

    const cti = clicks > 0 ? (installs / clicks) * 100 : 0
    const lastPeriodCti = lastPeriodClicks > 0 ? (lastPeriodInstalls / lastPeriodClicks) * 100 : 0

    const ctiIncrease = calculateIncrease(cti, lastPeriodCti)

    return {
      clicks,
      clicksIncrease,
      installs,
      installsIncrease,
      cti,
      ctiIncrease,
      revenue: 0, // TODO: implement revenue
      revenueIncrease: 0, // TODO: implement revenue
    }
  })

const calculateIncrease = (current: number, lastPeriod: number): number => {
  if (lastPeriod === 0) {
    return current > 0 ? 100 : 0
  }

  return ((current - lastPeriod) / lastPeriod) * 100
}
