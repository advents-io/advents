import { NextFetchEvent, NextRequest, NextResponse, userAgent } from 'next/server'

import { recordClick } from '@/helpers/click-helper'
import { supabaseClient } from '@/lib/supabase'
import { LOCALHOST_LINK_DOMAIN, WEBSITE_URL } from '@/utils/constants'
import { LINK_DOMAINS } from '@/utils/link-domains'

export const isLinkDomain = (req: NextRequest) => {
  const domain = getDomain(req)
  const isLinkDomain = LINK_DOMAINS.includes(domain)
  return isLinkDomain
}

export const linkMiddleware = async (req: NextRequest, event: NextFetchEvent) => {
  const domain = getDomain(req)

  const slug = req.nextUrl.pathname.split('/')[1]

  if (!slug) {
    return redirect(WEBSITE_URL)
  }

  const supabase = supabaseClient()

  // This was necessary because Prisma was not able to run on edge middleware in the Supabase database
  const link = (
    await supabase
      .from('links')
      .select('id, androidUrl:android_url, iosUrl:ios_url, fallbackUrl:fallback_url')
      .eq('slug', slug)
      .eq('domain', domain)
      .limit(1)
      .single()
  ).data

  if (!link) {
    return redirect(WEBSITE_URL)
  }

  let destinationUrl = link.fallbackUrl

  const isIos = userAgent(req).os?.name === 'iOS'
  if (isIos) {
    destinationUrl = link.iosUrl
  }

  const isAndroid = userAgent(req).os?.name === 'Android'
  if (isAndroid) {
    destinationUrl = link.androidUrl
  }

  event.waitUntil(recordClick(req, link.id, destinationUrl))
  return redirect(destinationUrl)
}

const redirect = (url: string) => {
  return NextResponse.redirect(url, {
    status: 302,
  })
}

const getDomain = (req: NextRequest) => {
  let domain = (req.headers.get('host') as string).replace('www.', '').toLowerCase()

  const isDevLinkDomain = domain === LOCALHOST_LINK_DOMAIN

  if (isDevLinkDomain) {
    domain = LINK_DOMAINS[0]
  }

  return domain
}
