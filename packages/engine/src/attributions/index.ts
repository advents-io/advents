import { AttributionMethod, Click, prisma } from '@advents/db'

import { Session } from '../events/routes/log-session'

interface AttributionData {
  method: AttributionMethod
  linkId: string
  clickId: string
  probabilisticConfidence: number | null
}

interface ClickProbabilisticMatch {
  clickId: string
  linkId: string
  confidence: number
}

export const handleAttribution = async (sessionId: string, session: Session, appId: string) => {
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
  session: Session,
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

  return null

  // TODO: implement
  return await handleProbabilisticAttribution(session, appId, 'android_probabilistic')
}

const handleIosAttribution = async (
  session: Session,
  appId: string,
): Promise<AttributionData | null> => {
  const { iosClipboardClickId: clickId } = session

  if (clickId) {
    return await handleClickIdAttribution(clickId, 'ios_deterministic_click')
  }

  return null

  // TODO: implement
  return await handleProbabilisticAttribution(session, appId, 'ios_probabilistic')
}

const handleClickIdAttribution = async (
  clickId: string,
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

  const clickAlreadyAttributed = !!click.attribution

  if (clickAlreadyAttributed) {
    return null
  }

  return {
    method,
    linkId: click.linkId,
    clickId,
    probabilisticConfidence: null,
  }
}

/*
  Verifications before running probabilistic attribution:
    - device not already attributed || is first session

  Add filters:
    - app_id
    - date
    - os
    - country
    - device model
    - clicks not already attributed

  Match confidence:
    - ip
    - distance from latitude and longitude between click and session
    - device model
*/

const handleProbabilisticAttribution = async (
  session: Session,
  appId: string,
  method: AttributionMethod,
): Promise<AttributionData | null> => {
  const attributionWindowInterval = 24 * 60 * 60 * 1000 // 24h
  const now = new Date()
  const attributionWindowStart = new Date(now.getTime() - attributionWindowInterval)

  const recentClicks = await prisma.click.findMany({
    where: {
      createdAt: {
        gte: attributionWindowStart,
      },
      link: {
        appId,
      },
      os: session.os,
      country: session.country,
      deviceModel: session.deviceModel,
      attribution: null,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (recentClicks.length === 0) {
    return null
  }

  const matchedClick = findBestMatch(recentClicks, session)

  return matchedClick
    ? {
        clickId: matchedClick.clickId,
        linkId: matchedClick.linkId,
        method,
        probabilisticConfidence: matchedClick.confidence,
      }
    : null
}

const findBestMatch = (clicks: Click[], session: Session): ClickProbabilisticMatch | null => {
  let bestMatch: ClickProbabilisticMatch | null = null

  for (const click of clicks) {
    const confidence = calculateConfidence(click, session)

    if (confidence > 0.7 && (!bestMatch || confidence > bestMatch.confidence)) {
      bestMatch = {
        clickId: click.id,
        linkId: click.linkId,
        confidence,
      }
    }
  }

  return bestMatch
}

const calculateConfidence = (click: Click, session: Session): number => {
  let matchScore = 0
  let totalScore = 0

  // IP match
  if (click.ip === session.ip) {
    matchScore += 0.3
  }
  totalScore += 0.3

  // Device model match
  if (click.deviceModel === session.deviceModel) {
    matchScore += 0.2
  }
  totalScore += 0.2

  // Geolocation match
  if (
    click.country === session.country &&
    click.region === session.region &&
    click.city === session.city
  ) {
    matchScore += 0.2
  }
  totalScore += 0.2

  // OS match
  if (click.os === session.os) {
    matchScore += 0.1
  }
  totalScore += 0.1

  // Browser match (if available in session data)
  // if (click.browser === session.browser) {
  //   matchScore += 0.1
  // }
  // totalScore += 0.1

  // User agent partial match
  if (session.userAgent && click.userAgent && session.userAgent.includes(click.userAgent)) {
    matchScore += 0.1
  }
  totalScore += 0.1

  const confidence = matchScore / totalScore

  return confidence
}
