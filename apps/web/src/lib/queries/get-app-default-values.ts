import { GetAppDefaultValuesInput, GetAppDefaultValuesOutput } from '@advents/queries/client'

import { queries } from '.'

export const getAppDefaultValues = async ({
  teamSlug,
  appSlug,
}: GetAppDefaultValuesInput): Promise<GetAppDefaultValuesOutput> => {
  const response = await queries
    .get<GetAppDefaultValuesOutput>(`team/${teamSlug}/app/${appSlug}/default-values`)
    .json()

  return response
}
