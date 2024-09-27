import { AttributionMethod, prisma } from '@advents/db'

import { Session } from '../routes/log-session'

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
          installCount: {
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
  const { androidInstallReferrer: referrer } = session

  if (!referrer || !referrer.includes('advents_click_id=')) {
    return null
  }

  const [, clickId] = referrer.split('advents_click_id=')

  if (!clickId) {
    return null
  }

  return await handleClickIdAttribution(clickId, sessionId, 'android_deterministic_referrer')
}

const handleIosAttribution = async (
  sessionId: string,
  session: Session,
): Promise<AttributionData | null> => {
  const { iosClipboardClickId: clickId } = session

  if (!clickId) {
    return null
  }

  return await handleClickIdAttribution(clickId, sessionId, 'ios_deterministic_click')
}

const handleClickIdAttribution = async (
  clickId: string,
  sessionId: string,
  method: AttributionMethod,
): Promise<AttributionData | null> => {
  const click = await prisma.click.findUnique({
    where: {
      id: clickId,
    },
    select: {
      attribution: {
        select: {
          id: true,
        },
      },
      linkId: true,
    },
  })

  if (!click) {
    return null
  }

  const clickAlreadyAttributed = click.attribution

  if (clickAlreadyAttributed) {
    return null
  }

  await prisma.attribution.create({
    data: {
      method,
      clickId,
      sessionId,
    },
  })

  return {
    linkId: click.linkId,
  }
}
