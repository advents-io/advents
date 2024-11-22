import { prisma } from '@advents/db'
import { getSessionUser } from '@advents/supabase/server'

import { EditAppQrcodeLogoForm } from './edit-app-qrcode-logo-form'

export default async function Page({ params }: { params: Promise<{ team: string; app: string }> }) {
  const { team: teamSlug, app: appSlug } = await params

  const user = await getSessionUser()

  if (!user) {
    return null
  }

  const app = await prisma.app.findFirst({
    where: {
      slug: appSlug,
      team: {
        slug: teamSlug,
        members: {
          some: {
            userId: user.id,
          },
        },
      },
    },
    select: {
      qrcodeLogoUrl: true,
    },
  })

  if (!app) {
    return null
  }

  return <EditAppQrcodeLogoForm qrcodeLogoUrl={app.qrcodeLogoUrl} />
}
