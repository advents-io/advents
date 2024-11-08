import { GetAppIdInput, GetAppIdOutput } from '@advents/queries/client'

import { queries } from '.'

export const getAppId = async ({ appSlug, teamSlug }: GetAppIdInput): Promise<GetAppIdOutput> => {
  const response = await queries
    .get<GetAppIdOutput>('app/id', {
      searchParams: {
        appSlug,
        teamSlug,
      },
    })
    .json()

  return response
}
