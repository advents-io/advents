import { NextRequest, NextResponse } from 'next/server'

import { nanoid } from '@/lib/nanoid'
import { prisma } from '@/lib/prisma'
import { createLinkSchema } from '@/schemas/create-link'
import { LINK_DOMAINS } from '@/utils/constants'

export async function POST(req: NextRequest) {
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

  const shortLink = 'https://' + domain + '/' + slug

  return NextResponse.json(
    {
      shortLink,
    },
    { status: 201 },
  )
}

const generateRandomSlug = async (domain: string) => {
  const slug = nanoid()

  const slugExists = (await prisma.link.count({ where: { domain, slug } })) > 0

  if (slugExists) {
    return generateRandomSlug(domain)
  }

  return slug
}
