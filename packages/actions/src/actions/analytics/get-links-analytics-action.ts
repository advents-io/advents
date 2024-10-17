'use server'

import { dayjs } from '@advents/common'
import { prisma } from '@advents/db'

import { authActionClient } from '../../safe-action'
import { getLinksAnalyticsInputSchema } from '../../schemas/input/analytics/get-links-analytics-input'
import { getLinksAnalyticsOutputSchema } from '../../schemas/output/analytics/get-links-analytics-output'

export const getLinksAnalyticsAction = authActionClient
  .schema(getLinksAnalyticsInputSchema)
  .outputSchema(getLinksAnalyticsOutputSchema)
  .action(async ({ parsedInput }) => {
    const { appSlug, startDate, endDate } = parsedInput

    const clicks = await prisma.click.findMany({
      select: {
        link: {
          select: {
            id: true,
            slug: true,
            domain: true,
            title: true,
            createdAt: true,
          },
        },
        attribution: {
          select: {
            id: true,
          },
        },
      },
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
    })

    const links = Object.values(
      clicks.reduce(
        (acc, click) => {
          const { id } = click.link

          if (!acc[id]) {
            acc[id] = {
              id,
              slug: click.link.slug,
              domain: click.link.domain,
              title: click.link.title,
              clicks: 0,
              installs: 0,
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
            createdAt: Date
          }
        >,
      ),
    )

    return links
  })
