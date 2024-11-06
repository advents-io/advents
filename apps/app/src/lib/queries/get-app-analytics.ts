import { GetAppAnalyticsOutput } from '@advents/queries'

import { queries } from '.'

export const getAppAnalytics = async (
  appSlug: string,
  teamSlug: string,
  startDate: string,
  endDate: string,
): Promise<GetAppAnalyticsOutput> => {
  const response = await queries
    .get<GetAppAnalyticsOutput>('analytics/app', {
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
