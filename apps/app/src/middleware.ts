import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { LINK_DOMAINS, WEBSITE_URL } from '@/utils/constants'

export default async function middleware(req: NextRequest) {
  const domain = (req.headers.get('host') as string).replace('www.', '').toLowerCase()

  if (!LINK_DOMAINS.includes(domain)) {
    return NextResponse.next()
  }

  const slug = req.nextUrl.pathname.split('/')[1]

  if (!slug) {
    return NextResponse.redirect(WEBSITE_URL, {
      status: 302,
    })
  }

  const link = await prisma.link.findUnique({
    where: {
      domain_slug: {
        domain,
        slug,
      },
    },
  })

  if (!link) {
    return NextResponse.redirect(WEBSITE_URL, {
      status: 302,
    })
  }

  return NextResponse.redirect(link.fallbackUrl, {
    status: 302,
  })
}
