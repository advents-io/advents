import { AttributionMethod, prisma } from '@advents/db'

import { AttributionData } from './attribution-data'

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
