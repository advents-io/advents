import { GetAppDomainsInput, GetAppDomainsOutput } from '@advents/queries/client'

import { queries } from '.'

export const getAppDomains = async ({
  appId,
}: GetAppDomainsInput): Promise<GetAppDomainsOutput> => {
  const response = await queries.get<GetAppDomainsOutput>(`app/${appId}/domains`).json()
  return response
}
