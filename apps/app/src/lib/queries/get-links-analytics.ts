import { dayjs } from '@advents/common'
import {
  GetLinksAnalyticsOutput,
  GetLinksAnalyticsParamsInput,
  GetLinksAnalyticsQueryInput,
} from '@advents/queries/client'

import { queries } from '.'

export const getLinksAnalytics = async ({
  teamSlug,
  appSlug,
  startDate,
  endDate,
}: GetLinksAnalyticsParamsInput &
  GetLinksAnalyticsQueryInput): Promise<GetLinksAnalyticsOutput> => {
  const response = await queries
    .get<GetLinksAnalyticsOutput>(`team/${teamSlug}/app/${appSlug}/links/analytics`, {
      searchParams: {
        startDate: dayjs(startDate).format('YYYY-MM-DD'),
        endDate: dayjs(endDate).format('YYYY-MM-DD'),
      },
    })
    .json()

  return response
}
