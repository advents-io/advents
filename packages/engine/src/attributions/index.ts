import { prisma } from '@advents/db'

import { SessionInput } from '../events/routes/log-session'
import { AttributionData } from './attribution-data'
import { handleClickIdAttribution } from './deterministic'
import { handleProbabilisticAttribution } from './probabilistic'

export const handleAttribution = async (
  sessionId: string,
  session: SessionInput,
  appId: string,
) => {
  try {
    let attributionData: AttributionData | null = null

    if (session.os === 'android') {
      attributionData = await handleAndroidAttribution(session, appId)
    }

    if (session.os === 'ios') {
      attributionData = await handleIosAttribution(session, appId)
    }

    if (attributionData) {
      await prisma.$transaction([
        prisma.attribution.create({
          data: {
            method: attributionData.method,
            clickId: attributionData.clickId,
            sessionId,
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
    }
  } catch {}
}

const handleAndroidAttribution = async (
  session: SessionInput,
  appId: string,
): Promise<AttributionData | null> => {
  const { androidInstallReferrer: referrer } = session

  if (
    !!referrer &&
    referrer.includes('advents_click_id=') &&
    !!referrer.split('advents_click_id=')[1]
  ) {
    const clickId = referrer.split('advents_click_id=')[1]

    return await handleClickIdAttribution(clickId, 'android_deterministic_referrer')
  }

  return await handleProbabilisticAttribution(session, appId, 'android_probabilistic')
}

const handleIosAttribution = async (
  session: SessionInput,
  appId: string,
): Promise<AttributionData | null> => {
  const { iosClipboardClickId: clickId } = session

  if (clickId) {
    return await handleClickIdAttribution(clickId, 'ios_deterministic_click')
  }

  return await handleProbabilisticAttribution(session, appId, 'ios_probabilistic')
}
