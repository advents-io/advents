import { dayjs } from '@advents/common'
import { GetAppAnalyticsInput, GetAppAnalyticsOutput } from '@advents/queries/client'

import { queries } from '.'

export const getAppAnalytics = async ({
  appSlug,
  teamSlug,
  startDate,
  endDate,
}: GetAppAnalyticsInput): Promise<GetAppAnalyticsOutput> => {
  const response = await queries
    .get<GetAppAnalyticsOutput>('analytics/app', {
      searchParams: {
        appSlug,
        teamSlug,
        startDate: dayjs(startDate).format('YYYY-MM-DD'),
        endDate: dayjs(endDate).format('YYYY-MM-DD'),
      },
    })
    .json()

  return response
}
