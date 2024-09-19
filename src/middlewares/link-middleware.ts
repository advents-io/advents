import { Link } from '@prisma/client'
import { NextFetchEvent, NextRequest, NextResponse, userAgent } from 'next/server'

import { logClick } from '@/helpers/click-helper'
import { supabaseClient } from '@/lib/supabase'
import { LOCALHOST_LINK_DOMAIN, WEBSITE_URL } from '@/utils/constants'
import { LINK_DOMAINS } from '@/utils/link-domains'

export const isLinkDomain = (req: NextRequest) => {
  const domain = getDomain(req)
  const isLinkDomain = LINK_DOMAINS.includes(domain)
  return isLinkDomain
}

interface LinkProps extends Pick<Link, 'id' | 'androidUrl' | 'iosUrl' | 'fallbackUrl'> {}

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
  ).data as LinkProps

  if (!link) {
    return redirect(WEBSITE_URL)
  }

  let destinationUrl = new URL(link.fallbackUrl)

  const isIos = userAgent(req).os?.name === 'iOS'
  if (isIos) {
    destinationUrl = new URL(link.iosUrl)
    destinationUrl.searchParams.append('referrer', `advents_click_id=${link.id}`)
  }

  const isAndroid = userAgent(req).os?.name === 'Android'
  if (isAndroid) {
    destinationUrl = new URL(link.androidUrl)
    destinationUrl.searchParams.append('referrer', `advents_click_id=${link.id}`)
  }

  if (!isIos && !isAndroid) {
    destinationUrl.searchParams.append('utm_source', 'advents')
    destinationUrl.searchParams.append('utm_medium', 'link')
    destinationUrl.searchParams.append('utm_campaign', link.id)
  }

  event.waitUntil(logClick(req, link.id, destinationUrl.toString()))

  return redirect(destinationUrl.toString())
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
