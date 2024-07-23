import { NextRequest, NextResponse, userAgent } from 'next/server'

import { prisma } from '@/lib/prisma'
import { LINK_DOMAINS, WEBSITE_URL } from '@/utils/constants'

export default async function middleware(req: NextRequest) {
  let domain = (req.headers.get('host') as string).replace('www.', '').toLowerCase()

  const isDevLinkDomain = domain === 'l.localhost:3000' || domain.endsWith('.vercel.app')

  if (isDevLinkDomain) {
    domain = LINK_DOMAINS[0]
  }

  const isLinkDomain = LINK_DOMAINS.includes(domain)

  if (!isLinkDomain) {
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

  const isIos = userAgent(req).os?.name === 'iOS'

  if (isIos) {
    return NextResponse.redirect(link.iosUrl, {
      status: 302,
    })
  }

  const isAndroid = userAgent(req).os?.name === 'Android'

  if (isAndroid) {
    return NextResponse.redirect(link.iosUrl, {
      status: 302,
    })
  }

  return NextResponse.redirect(link.fallbackUrl, {
    status: 302,
  })
}
