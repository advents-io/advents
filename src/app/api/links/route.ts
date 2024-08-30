import { NextRequest } from 'next/server'

import { createLinkInputSchema } from '@/http/dtos/input/create-link-input'
import { errorHandler } from '@/http/error-handler'
import { BadRequestError } from '@/http/errors/bad-request-error'
import { created } from '@/http/responses/created'
import { prisma } from '@/lib/prisma'
import { generateRandomSlug } from '@/utils/link-helper'

export async function POST(req: NextRequest) {
  return await errorHandler(async () => {
    const {
      title,
      domain,
      slug: reqSlug,
      iosUrl,
      androidUrl,
      fallbackUrl,
    } = createLinkInputSchema.parse(await req.json())

    if (reqSlug) {
      const linkExists = await prisma.link.findUnique({
        select: { id: true },
        where: {
          domain_slug: {
            domain,
            slug: reqSlug,
          },
        },
      })

      if (linkExists) {
        throw new BadRequestError(`Link duplicado.\n\nO link curto "${reqSlug}" já existe.`)
      }
    }

    const slug = reqSlug || (await generateRandomSlug(domain))

    await prisma.link.create({
      data: {
        title,
        domain,
        slug,
        iosUrl,
        androidUrl,
        fallbackUrl,
      },
    })

    return created()
  })
}
