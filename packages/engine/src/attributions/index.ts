import { prisma, Session } from '@advents/db'

import { AttributionData } from './attribution-data'
import { handleClickIdAttribution } from './deterministic'
import { handleProbabilisticAttribution } from './probabilistic'

export const handleAttribution = async (session: Session) => {
  try {
    let attributionData: AttributionData | null = null

    if (session.os === 'android') {
      attributionData = await handleAndroidAttribution(session)
    }

    if (session.os === 'ios') {
      attributionData = await handleIosAttribution(session)
    }

    if (!attributionData) {
      return
    }

    await prisma.$transaction([
      prisma.attribution.create({
        data: {
          method: attributionData.method,
          sessionId: session.id,
          clickId: attributionData.clickId,
          appId: session.appId,
          linkId: attributionData.linkId,
        },
      }),

      prisma.link.update({
        where: {
          id: attributionData.linkId,
        },
        data: {
          installCount: {
            increment: 1,
          },
        },
      }),
    ])
  } catch {}
}

const handleAndroidAttribution = async (session: Session): Promise<AttributionData | null> => {
  const { androidInstallReferrer: referrer } = session

  if (
    !!referrer &&
    referrer.includes('advents_click_id=') &&
    !!referrer.split('advents_click_id=')[1]
  ) {
    const clickId = referrer.split('advents_click_id=')[1]

    return await handleClickIdAttribution(clickId, 'android_deterministic_referrer')
  }

  return await handleProbabilisticAttribution(session, 'android_probabilistic')
}

const handleIosAttribution = async (session: Session): Promise<AttributionData | null> => {
  const { iosClipboardClickId: clickId } = session

  if (clickId) {
    return await handleClickIdAttribution(clickId, 'ios_deterministic_click')
  }

  return await handleProbabilisticAttribution(session, 'ios_probabilistic')
}
