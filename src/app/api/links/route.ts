import { NextRequest } from 'next/server'

import { errorHandler } from '@/api/error-handler'
import { created } from '@/api/responses'
import { nanoid } from '@/lib/nanoid'
import { prisma } from '@/lib/prisma'
import { createLinkSchema } from '@/schemas/link'
import { LINK_DOMAINS } from '@/utils/constants'

export async function POST(req: NextRequest) {
  return await errorHandler(async () => {
    const {
      slug: reqSlug,
      iosUrl,
      androidUrl,
      fallbackUrl,
    } = createLinkSchema.parse(await req.json())

    const domain = LINK_DOMAINS[0]

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
