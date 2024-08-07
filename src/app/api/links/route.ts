import { NextRequest } from 'next/server'

import { createLinkInputSchema } from '@/api/dtos/input'
import { errorHandler } from '@/api/error-handler'
import { BadRequestError } from '@/api/errors'
import { created } from '@/api/responses'
import { nanoid } from '@/lib/nanoid'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  return await errorHandler(async () => {
    const {
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

const generateRandomSlug = async (domain: string) => {
  const slug = nanoid()

  const linkExists = await prisma.link.findUnique({
    select: { id: true },
    where: {
      domain_slug: {
        domain,
        slug,
      },
    },
  })

  if (linkExists) {
    return generateRandomSlug(domain)
  }

  return slug
}
