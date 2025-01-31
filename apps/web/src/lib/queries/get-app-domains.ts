import { GetAppDomainsInput, GetAppDomainsOutput } from '@advents/queries/client'

import { queries } from '.'

export const getAppDomains = async ({
  teamSlug,
  appSlug,
}: GetAppDomainsInput): Promise<GetAppDomainsOutput> => {
  const response = await queries
    .get<GetAppDomainsOutput>(`team/${teamSlug}/app/${appSlug}/domains`)
    .json()
  return response
}
