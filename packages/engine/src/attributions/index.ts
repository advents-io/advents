import { discord } from '@advents/common'
import { AttributionMethod, prisma, Session } from '@advents/db'

import { handleClickIdAttribution } from './deterministic'
import { handleProbabilisticAttribution } from './probabilistic'

export type AttributionData = {
  clickId: string
  linkId: string
  method: AttributionMethod
  confidence: number

  metadata: {
    shortLink: string
    appName: string
  }
}

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
          clickId: attributionData.clickId,
          linkId: attributionData.linkId,
          method: attributionData.method,
          confidence: attributionData.confidence,
          sessionId: session.id,
          deviceId: session.deviceId,
          installId: session.installId,
          appId: session.appId,
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
  } catch (error) {
    await discord.sendErrorLog({
      description: 'Erro no `handleAttribution`',
      error,
    })
  }
}

const handleAndroidAttribution = async (session: Session): Promise<AttributionData | null> => {
  const { androidInstallReferrer: referrer } = session

  if (
    !referrer ||
    !referrer.includes('advents_click_id=') ||
    !referrer.split('advents_click_id=')[1]
  ) {
    return null
  }

  const clickId = referrer.split('advents_click_id=')[1]

  return await handleClickIdAttribution(clickId, 'android_deterministic_referrer')
}

const handleIosAttribution = async (session: Session): Promise<AttributionData | null> => {
  const { iosClipboardClickId: clickId } = session

  if (clickId) {
    return await handleClickIdAttribution(clickId, 'ios_deterministic_click')
  }

  return await handleProbabilisticAttribution(session, 'ios_probabilistic')
}
