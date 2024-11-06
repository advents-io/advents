import { GetLinkInput, GetLinkOutput } from '@advents/queries'

import { queries } from '.'

export const getLink = async ({ linkId }: GetLinkInput): Promise<GetLinkOutput> => {
  const response = await queries
    .get<GetLinkOutput>('link', {
      searchParams: {
        linkId,
      },
    })
    .json()

  return response
}
