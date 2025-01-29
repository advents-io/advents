/* TODO: improve probabilistic attribution
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

import { AttributionData } from '.'
import { attributionSettings } from './settings'

export const handleProbabilisticAttribution = async (
  session: Session,
  method: AttributionMethod,
): Promise<AttributionData | null> => {
  if (!session.isFirstSession) {
    // If it's not the first session, the attribution is already done
    return null
  }

  if (session.clearedAppLocalData) {
    // If the user cleared app local data, the attribution is already done in the first session
    return null
  }

  const attributionWindowStart = attributionSettings.getProbabilisticAttributionWindowStart()

  const recentClicks = await prisma.click.findMany({
    where: {
      createdAt: {
        gte: attributionWindowStart,
      },
      appId: session.appId,
      os: session.os,
      attribution: null,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (recentClicks.length === 0) {
    return null
  }

  const attributedClick = calculateProbabilisticAttribution(recentClicks, session)

  if (!attributedClick) {
    return null
  }

  const click = await prisma.click.findUnique({
    where: {
      id: attributedClick.id,
    },
    select: {
      id: true,
      link: {
        select: {
          id: true,
          domain: true,
          slug: true,
        },
      },
      app: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!click) {
    return null
  }

  return {
    clickId: click.id,
    linkId: click.link.id,
    method,
    confidence: attributedClick.confidence,

    metadata: {
      shortLink: `${click.link.domain}/${click.link.slug}`,
      appName: click.app.name,
    },
  }
}

type AttributedClick = {
  id: string
  confidence: number
}

const calculateProbabilisticAttribution = (
  clicks: Click[],
  session: Session,
): AttributedClick | null => {
  let bestMatch: AttributedClick | null = null

  for (const click of clicks) {
    const confidence = calculateAttributionConfidence(click, session)

    if (confidence > 0.7 && (!bestMatch || confidence > bestMatch.confidence)) {
      bestMatch = {
        id: click.id,
        confidence,
      }
    }
  }

  return bestMatch
}

const calculateAttributionConfidence = (click: Click, session: Session): number => {
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

  // TODO: implement distance match

  const confidence = matchScore / totalScore

  return confidence
}
