'use server'

import { prisma } from '@advents/db'

import { authActionClient } from '../../safe-action'
import { getLinksAnalyticsInputSchema } from '../../schemas/input/analytics/get-links-analytics-input'
import { getLinksAnalyticsOutputSchema } from '../../schemas/output/analytics/get-links-analytics-output'

export const getLinksAnalyticsAction = authActionClient
  .schema(getLinksAnalyticsInputSchema)
  .outputSchema(getLinksAnalyticsOutputSchema)
  .action(async ({ parsedInput }) => {
    const links = await prisma.link.findMany({
      select: {
        slug: true,
        domain: true,
        title: true,
        clickCount: true,
        installCount: true,
        createdAt: true,
      },
      where: {
        app: {
          slug: parsedInput.appSlug,
        },
      },
    })

    return links.map(({ clickCount, installCount, ...item }) => {
      return {
        clicks: clickCount,
        installs: installCount,
        ...item,
      }
    })
  })
