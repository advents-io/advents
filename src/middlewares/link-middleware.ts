import { NextRequest, NextResponse, userAgent } from 'next/server'

import { supabaseClient } from '@/lib/supabase'
import { LINK_DOMAINS, WEBSITE_URL } from '@/utils/constants'

export const isLinkDomain = (req: NextRequest) => {
  const domain = getDomain(req)
  const isLinkDomain = LINK_DOMAINS.includes(domain)
  return isLinkDomain
}

export const linkMiddleware = async (req: NextRequest) => {
  const domain = getDomain(req)

  const slug = req.nextUrl.pathname.split('/')[1]

  if (!slug) {
    return NextResponse.redirect(WEBSITE_URL, {
      status: 302,
    })
  }

  const supabase = supabaseClient()

  // This was necessary because Prisma was not able to run on edge middleware in the Supabase database
  const link = (
    await supabase
      .from('links')
      .select('androidUrl:android_url, iosUrl:ios_url, fallbackUrl:fallback_url')
      .eq('slug', slug)
      .eq('domain', domain)
      .limit(1)
      .single()
  ).data

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
    return NextResponse.redirect(link.androidUrl, {
      status: 302,
    })
  }

  return NextResponse.redirect(link.fallbackUrl, {
    status: 302,
  })
}

const getDomain = (req: NextRequest) => {
  let domain = (req.headers.get('host') as string).replace('www.', '').toLowerCase()

  const isDevLinkDomain = domain === 'l.localhost:3000'

  if (isDevLinkDomain) {
    domain = LINK_DOMAINS[0]
  }

  return domain
}
