import { routes, WEBSITE_URL } from '@advents/common'
import { Link } from '@advents/db'
import { LINK_DEFAULT_DOMAIN, LINK_LOCALHOST_DOMAIN } from '@advents/queries/server'
import { supabaseServer } from '@advents/supabase/server'
import { NextFetchEvent, NextRequest, NextResponse, userAgent } from 'next/server'

import { logClick } from './log-click'

export const isLinkDomain = (req: NextRequest) => {
  const domain = getDomain(req)
  const isLinkDomain = getWebAppDomain(false) !== domain
  return isLinkDomain
}

type LinkProps = Pick<
  Link,
  'id' | 'androidUrl' | 'iosUrl' | 'fallbackUrl' | 'appId' | 'disableIosPreviewPage'
>

export const clickMiddleware = async (req: NextRequest, event: NextFetchEvent) => {
  const domain = getDomain(req)

  const slug = req.nextUrl.pathname.split('/')[1]

  if (!slug) {
    return redirect(WEBSITE_URL)
  }

  const supabase = await supabaseServer()

  // This was necessary because Prisma was not able to run on edge middleware in the Supabase database
  const link = (
    await supabase
      .from('links')
      .select(
        `
        id,
        androidUrl:android_url,
        iosUrl:ios_url,
        disableIosPreviewPage:disable_ios_preview_page,
        fallbackUrl:fallback_url,
        appId:app_id
        `,
      )
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

  const ua = userAgent(req)

  const isIos = ua.os?.name === 'iOS'
  if (isIos) {
    destinationUrl = !link.disableIosPreviewPage
      ? new URL(routes.IOS_CLICK.path, getWebAppDomain(true))
      : new URL(link.iosUrl)

    if (!link.disableIosPreviewPage) {
      destinationUrl.searchParams.append('click_id', clickId)
      destinationUrl.searchParams.append('app_id', link.appId)
      destinationUrl.searchParams.append('redirect', link.iosUrl)
    }
  }

  const isAndroid = ua.os?.name === 'Android'
  if (isAndroid) {
    destinationUrl = new URL(link.androidUrl)
    destinationUrl.searchParams.append('launch', 'true') // If the user has the app installed, it will open the app instead of redirecting to the Play Store
    destinationUrl.searchParams.append('referrer', `advents_click_id=${clickId}`)
  }

  event.waitUntil(logClick(req, clickId, link.id, link.appId, destinationUrl.toString()))

  return redirect(destinationUrl.toString())
}

const redirect = (url: string) => {
  return NextResponse.redirect(url, {
    status: 307,
  })
}

const getDomain = (req: NextRequest) => {
  let domain = (req.headers.get('host') as string).replace('www.', '').toLowerCase()

  const isDevLinkDomain = domain === LINK_LOCALHOST_DOMAIN

  if (isDevLinkDomain) {
    domain = LINK_DEFAULT_DOMAIN
  }

  return domain
}

const getWebAppDomain = (withProtocol: boolean) => {
  const isLocalhost = process.env.VERCEL !== '1'

  let domain =
    process.env.VERCEL === '1'
      ? process.env.VERCEL_ENV === 'production'
        ? 'app.advents.io'
        : 'dev.advents.io'
      : 'localhost:3000'

  const protocol = withProtocol ? (isLocalhost ? 'http://' : 'https://') : ''

  domain = protocol + domain

  return domain
}
