import { Session } from '@/api/schemas/session-schema'
import { prisma } from '@/lib/prisma'

interface AttributionData {
  isNewInstall: boolean
  linkId?: string
}

export const checkAttribution = async (sessionId: string, session: Session) => {
  try {
    let attributionData: AttributionData | undefined

    if (session.os === 'android') {
      attributionData = await checkAndroidAttribution(sessionId, session)
    }

    if (session.os === 'ios') {
      attributionData = await checkIosAttribution(sessionId, session)
    }

    if (attributionData && attributionData.isNewInstall && attributionData.linkId) {
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

const checkAndroidAttribution = async (
  sessionId: string,
  session: Session,
): Promise<AttributionData> => {
  const referrer = session.androidInstallReferrer

  if (!referrer || !referrer.includes('advents_click_id')) {
    return {
      isNewInstall: false,
    }
  }

  const [, clickId] = referrer.split('advents_click_id=')

  if (!clickId) {
    return {
      isNewInstall: false,
    }
  }

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
      isNewInstall: false,
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
      isNewInstall: false,
    }
  }

  await prisma.install.create({
    data: {
      clickId: click.id,
      sessionId,
    },
  })

  return {
    isNewInstall: true,
    linkId: click.linkId,
  }
}

const checkIosAttribution = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sessionId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  session: Session,
): Promise<AttributionData> => {
  // TODO: implement

  return {
    isNewInstall: false,
  }
}
