import { NextRequest } from 'next/server'

import { GetLinkOutputProps, getLinkOutputSchema } from '@/api/dtos/output'
import { errorHandler } from '@/api/error-handler'
import { BadRequestError } from '@/api/errors'
import { ok } from '@/api/responses'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: { linkId: string } }) {
  return await errorHandler(async () => {
    const link = await prisma.link.findUnique({
      where: {
        id: params.linkId,
      },
    })

    if (!link) {
      throw new BadRequestError('Link não encontrado')
    }

    const result = getLinkOutputSchema.parse(link)

    return ok<GetLinkOutputProps>(result)
  })
}
