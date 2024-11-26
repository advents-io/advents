import { dayjs } from '@advents/common'
import {
  GetAppAnalyticsOutput,
  GetAppAnalyticsParamsInput,
  GetAppAnalyticsQueryInput,
} from '@advents/queries/client'

import { queries } from '.'

export const getAppAnalytics = async ({
  teamSlug,
  appSlug,
  startDate,
  endDate,
}: GetAppAnalyticsParamsInput & GetAppAnalyticsQueryInput): Promise<GetAppAnalyticsOutput> => {
  const response = await queries
    .get<GetAppAnalyticsOutput>(`team/${teamSlug}/app/${appSlug}/analytics`, {
      searchParams: {
        startDate: dayjs(startDate).format('YYYY-MM-DD'),
        endDate: dayjs(endDate).format('YYYY-MM-DD'),
      },
    })
    .json()

  return response
}
