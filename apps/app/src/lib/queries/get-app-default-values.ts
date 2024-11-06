import { GetAppDefaultValuesInput, GetAppDefaultValuesOutput } from '@advents/queries'

import { queries } from '.'

export const getAppDefaultValues = async ({
  appSlug,
  teamSlug,
}: GetAppDefaultValuesInput): Promise<GetAppDefaultValuesOutput> => {
  const response = await queries
    .get<GetAppDefaultValuesOutput>('app/default-values', {
      searchParams: {
        appSlug,
        teamSlug,
      },
    })
    .json()

  return response
}
