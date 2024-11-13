import { GetAppQrCodeLogoUrlInput, GetAppQrCodeLogoUrlOutput } from '@advents/queries/client'

import { queries } from '.'

export const getAppQrCodeLogoUrl = async ({
  teamSlug,
  appSlug,
}: GetAppQrCodeLogoUrlInput): Promise<GetAppQrCodeLogoUrlOutput> => {
  const response = await queries
    .get<GetAppQrCodeLogoUrlOutput>(`team/${teamSlug}/app/${appSlug}/qrcode-logo`)
    .json()

  return response
}
