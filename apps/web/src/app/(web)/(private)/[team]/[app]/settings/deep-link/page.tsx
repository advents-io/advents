import { prisma } from '@advents/db'

import { ErrorAlert } from '@/components/error-alert'

import { DeepLinkingForm } from './deep-linking-form'

export default async function Page(props: { params: Promise<{ team: string; app: string }> }) {
  const params = await props.params

  const app = await prisma.app.findFirst({
    where: {
      slug: params.app,
      team: {
        slug: params.team,
      },
    },
    select: {
      id: true,
      scheme: true,
      enableAndroidAppLinks: true,
      androidCertFingerprints: {
        select: {
          id: true,
          sha256Fingerprint: true,
        },
      },
      enableIosUniversalLinks: true,
      appleTeamId: true,
      iosBundleIds: {
        select: {
          id: true,
          bundleId: true,
        },
      },
    },
  })

  if (!app) {
    return <ErrorAlert error='Não foi possível encontrar o app.' />
  }

  return <DeepLinkingForm app={app} />
}
