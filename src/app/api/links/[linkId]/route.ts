import { NextRequest } from 'next/server'

import { createLinkInputSchema } from '@/http/dtos/input'
import { GetLinkOutputProps, getLinkOutputSchema } from '@/http/dtos/output'
import { errorHandler } from '@/http/error-handler'
import { BadRequestError } from '@/http/errors'
import { NotFoundError } from '@/http/errors/not-found-error'
import { noContent, ok } from '@/http/responses'
import { prisma } from '@/lib/prisma'
import { generateRandomSlug } from '@/utils/link-helper'

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

export async function PUT(
  req: NextRequest,
  { params: { linkId } }: { params: { linkId: string } },
) {
  return await errorHandler(async () => {
    const newLink = createLinkInputSchema.parse(await req.json())

    const originalLink = await prisma.link.findUnique({ where: { id: linkId } })

    if (!originalLink) {
      throw new NotFoundError('Link não encontrado.')
    }

    if (
      newLink.slug &&
      (originalLink.domain !== newLink.domain || originalLink.slug !== newLink.slug)
    ) {
      const newLinkExists = await prisma.link.findUnique({
        select: { id: true },
        where: {
          domain_slug: {
            domain: newLink.domain,
            slug: newLink.slug,
          },
        },
      })

      if (newLinkExists) {
        throw new BadRequestError(`Link duplicado.\n\nO link curto "${newLink.slug}" já existe.`)
      }
    }

    newLink.slug = newLink.slug || (await generateRandomSlug(newLink.domain))

    const link = {
      ...originalLink,
      ...newLink,
    }

    await prisma.link.update({
      where: {
        id: linkId,
      },
      data: link,
    })

    return noContent()
  })
}
