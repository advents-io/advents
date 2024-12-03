import { AttributionMethod, prisma } from '@advents/db'

import { AttributionData } from '.'

export const handleClickIdAttribution = async (
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

  const clickAlreadyAttributed = !!click.attribution

  if (clickAlreadyAttributed) {
    return null
  }

  return {
    clickId,
    linkId: click.link.id,
    method,
    confidence: 1,

    metadata: {
      shortLink: `${click.link.domain}/${click.link.slug}`,
      appName: click.app.name,
    },
  }
}
