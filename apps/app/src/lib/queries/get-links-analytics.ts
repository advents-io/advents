import { GetLinksAnalyticsOutput } from '@advents/queries'

import { queries } from '.'

export const getLinksAnalytics = async (
  appSlug: string,
  teamSlug: string,
  startDate: string,
  endDate: string,
): Promise<GetLinksAnalyticsOutput> => {
  const response = await queries
    .get<GetLinksAnalyticsOutput>('analytics/links', {
      searchParams: {
        appSlug,
        teamSlug,
        startDate,
        endDate,
      },
    })
    .json()

  return response
}
