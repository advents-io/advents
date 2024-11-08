import { dayjs } from '@advents/common'
import { GetLinksAnalyticsInput, GetLinksAnalyticsOutput } from '@advents/queries/client'

import { queries } from '.'

export const getLinksAnalytics = async ({
  appSlug,
  teamSlug,
  startDate,
  endDate,
}: GetLinksAnalyticsInput): Promise<GetLinksAnalyticsOutput> => {
  const response = await queries
    .get<GetLinksAnalyticsOutput>('analytics/links', {
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
