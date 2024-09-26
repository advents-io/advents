import { logClick } from '@advents/api'
import { Link } from '@advents/db'
import { supabaseClient } from '@advents/supabase'
import { NextFetchEvent, NextRequest, NextResponse, userAgent } from 'next/server'

import { WEBSITE_URL } from '@/utils/constants'
import {
  APP_DOMAIN,
  LINK_DOMAINS,
  LOCALHOST_APP_DOMAIN,
  LOCALHOST_LINK_DOMAIN,
} from '@/utils/domains'
import { routes } from '@/utils/routes'

export const isLinkDomain = (req: NextRequest) => {
  const domain = getDomain(req)
  const isLinkDomain = LINK_DOMAINS.includes(domain)
  return isLinkDomain
}

interface LinkProps extends Pick<Link, 'id' | 'androidUrl' | 'iosUrl' | 'fallbackUrl' | 'appId'> {}

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
      .select('id, androidUrl:android_url, iosUrl:ios_url, fallbackUrl:fallback_url, appId:app_id')
      .eq('slug', slug)
      .eq('domain', domain)
      .limit(1)
      .single()
  ).data as LinkProps

  if (!link) {
    return redirect(WEBSITE_URL)
  }

  const clickId = crypto.randomUUID()

  let destinationUrl = new URL(link.fallbackUrl)

  const isIos = userAgent(req).os?.name === 'iOS'
  if (isIos) {
    const isLocalhost = req.headers.get('host')?.includes('localhost') ?? true
    const baseUrl = isLocalhost ? LOCALHOST_APP_DOMAIN : APP_DOMAIN

    destinationUrl = new URL(routes.IOS_CLICK.path, baseUrl)
    destinationUrl.searchParams.append('click_id', clickId)
    destinationUrl.searchParams.append('app_id', link.appId)
    destinationUrl.searchParams.append('redirect', link.iosUrl)
  }

  const isAndroid = userAgent(req).os?.name === 'Android'
  if (isAndroid) {
    destinationUrl = new URL(link.androidUrl)
    destinationUrl.searchParams.append('launch', 'true') // If the user has the app installed, it will open the app instead of redirecting to the Play Store
    destinationUrl.searchParams.append('referrer', `advents_click_id=${clickId}`)
  }

  event.waitUntil(logClick(req, clickId, link.id, destinationUrl.toString()))

  return redirect(destinationUrl.toString())
}

const redirect = (url: string) => {
  return NextResponse.redirect(url, {
    status: 302,
  })
}

const getDomain = (req: NextRequest) => {
  let domain = (req.headers.get('host') as string).replace('www.', '').toLowerCase()

  const isDevLinkDomain =
    domain === LOCALHOST_LINK_DOMAIN &&
    // Workaround because the redirect to the iOS click route not change the host header
    // and this methods would always return true when redirecting to the iOS click route
    req.nextUrl.pathname !== routes.IOS_CLICK.path

  if (isDevLinkDomain) {
    domain = LINK_DOMAINS[0]
  }

  return domain
}
