import { GetLinkInput, GetLinkOutput } from '@advents/queries/client'

import { queries } from '.'

export const getLink = async ({ linkId }: GetLinkInput): Promise<GetLinkOutput> => {
  const response = await queries.get<GetLinkOutput>(`link/${linkId}`).json()
  return response
}
