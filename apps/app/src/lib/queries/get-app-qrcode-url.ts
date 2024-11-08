import { GetAppQrCodeUrlInput, GetAppQrCodeUrlOutput } from '@advents/queries/client'

import { queries } from '.'

export const getAppQrCodeUrl = async ({
  appSlug,
  teamSlug,
}: GetAppQrCodeUrlInput): Promise<GetAppQrCodeUrlOutput> => {
  const response = await queries
    .get<GetAppQrCodeUrlOutput>('app/qrcode', {
      searchParams: {
        appSlug,
        teamSlug,
      },
    })
    .json()

  return response
}
