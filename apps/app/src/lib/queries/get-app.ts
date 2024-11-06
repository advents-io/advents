import { GetAppInput, GetAppOutput } from '@advents/queries'

import { queries } from '.'

export const getApp = async ({ appSlug, teamSlug }: GetAppInput): Promise<GetAppOutput> => {
  const response = await queries
    .get<GetAppOutput>('app', {
      searchParams: {
        appSlug,
        teamSlug,
      },
    })
    .json()

  return response
}
