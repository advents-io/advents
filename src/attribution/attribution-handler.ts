import { Session } from '@/api/schemas/session-schema'
import { prisma } from '@/lib/prisma'

interface AttributionData {
  newAttributionSession: boolean
  linkId?: string
}

export const handleAttribution = async (sessionId: string, session: Session) => {
  try {
    let attributionData: AttributionData | undefined

    if (session.os === 'android') {
      attributionData = await handleAndroidAttribution(sessionId, session)
    }

    if (session.os === 'ios') {
      attributionData = await handleIosAttribution(sessionId, session)
    }

    if (attributionData && attributionData.newAttributionSession && attributionData.linkId) {
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
): Promise<AttributionData> => {
  const referrer = session.androidInstallReferrer

  if (!referrer || !referrer.includes('advents_click_id')) {
    return {
      newAttributionSession: false,
    }
  }

  const [, clickId] = referrer.split('advents_click_id=')

  if (!clickId) {
    return {
      newAttributionSession: false,
    }
  }

  return await handleClickIdAttribution(clickId, sessionId)
}

const handleIosAttribution = async (
  sessionId: string,
  session: Session,
): Promise<AttributionData> => {
  const clickId = session.iosClickId

  if (!clickId) {
    return {
      newAttributionSession: false,
    }
  }

  if (!clickId) {
    return {
      newAttributionSession: false,
    }
  }

  return await handleClickIdAttribution(clickId, sessionId)
}

const handleClickIdAttribution = async (
  clickId: string,
  sessionId: string,
): Promise<AttributionData> => {
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
    return {
      newAttributionSession: false,
    }
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
    return {
      newAttributionSession: false,
    }
  }

  await prisma.install.create({
    data: {
      clickId: click.id,
      sessionId,
    },
  })

  return {
    newAttributionSession: true,
    linkId: click.linkId,
  }
}
