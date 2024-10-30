/* TODO: Verifications before running probabilistic attribution:
 *   - device not already attributed || is first session
 *
 * Add filters:
 *   - app_id
 *   - date
 *   - os
 *   - country
 *   - device model
 *   - clicks not already attributed
 *
 * Match confidence:
 *   - ip
 *   - distance from latitude and longitude between click and session
 *   - device model
 */

import { AttributionMethod, Click, prisma, Session } from '@advents/db'

import { AttributionData } from './attribution-data'

interface ClickProbabilisticMatch {
  clickId: string
  linkId: string
  confidence: number
}

export const handleProbabilisticAttribution = async (
  session: Session,
  method: AttributionMethod,
): Promise<AttributionData | null> => {
  // TODO: remove in the future, after improve the method
  if (session.os === 'android') {
    return null
  }

  const attributionWindowInterval = 24 * 60 * 60 * 1000 // 24h
  const now = new Date()
  const attributionWindowStart = new Date(now.getTime() - attributionWindowInterval)

  const recentClicks = await prisma.click.findMany({
    where: {
      createdAt: {
        gte: attributionWindowStart,
      },
      appId: session.appId,
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

  const matchedClick = matchClickAndSession(recentClicks, session)

  return matchedClick
    ? {
        clickId: matchedClick.clickId,
        linkId: matchedClick.linkId,
        method,
        probabilisticConfidence: matchedClick.confidence,
      }
    : null
}

const matchClickAndSession = (
  clicks: Click[],
  session: Session,
): ClickProbabilisticMatch | null => {
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
