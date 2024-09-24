import { Session } from '@/api/schemas/session-schema'
import { prisma } from '@/lib/prisma'

interface AttributionData {
  linkId: string
}

export const handleAttribution = async (sessionId: string, session: Session) => {
  try {
    let attributionData: AttributionData | null = null

    if (session.os === 'android') {
      attributionData = await handleAndroidAttribution(sessionId, session)
    }

    if (session.os === 'ios') {
      attributionData = await handleIosAttribution(sessionId, session)
    }

    if (attributionData) {
      await prisma.link.update({
        where: {
          id: attributionData.linkId,
        },
        data: {
          installs: {
            increment: 1,
          },
        },
      })
    }
  } catch {}
}

const handleAndroidAttribution = async (
  sessionId: string,
  session: Session,
): Promise<AttributionData | null> => {
  if (!session.android) {
    return null
  }

  const referrer = session.android.installReferrer

  if (!referrer || !referrer.includes('advents_click_id')) {
    return null
  }

  const [, clickId] = referrer.split('advents_click_id=')

  if (!clickId) {
    return null
  }

  return await handleClickIdAttribution(clickId, sessionId)
}

const handleIosAttribution = async (
  sessionId: string,
  session: Session,
): Promise<AttributionData | null> => {
  if (!session.ios) {
    return null
  }

  const clickId = session.ios.clickId

  if (!clickId) {
    return null
  }

  return await handleClickIdAttribution(clickId, sessionId)
}

const handleClickIdAttribution = async (
  clickId: string,
  sessionId: string,
): Promise<AttributionData | null> => {
  const click = await prisma.click.findUnique({
    where: {
      id: clickId,
    },
    select: {
      id: true,
      linkId: true,
    },
  })

  if (!click) {
    return null
  }

  const hasInstall = await prisma.install.findUnique({
    where: {
      clickId,
    },
    select: {
      id: true,
    },
  })

  if (hasInstall) {
    return null
  }

  await prisma.install.create({
    data: {
      clickId: click.id,
      sessionId,
    },
  })

  return {
    linkId: click.linkId,
  }
}
