import { isStoreUrl, routes, WWW_URL } from '@advents/common'
import { App as AppDb, Link as LinkDb } from '@advents/db'
import { SupabaseClient, supabaseServer } from '@advents/supabase/server'
import { NextFetchEvent, NextRequest, NextResponse, userAgent } from 'next/server'

import { logClick } from './log-click'

export const isLinkDomain = (req: NextRequest) => {
  const requestDomain = getDomain(req)
  const webDomain = getWebDomain(false)

  const isLinkDomain = requestDomain !== webDomain
  return isLinkDomain
}

type Link = Pick<
  LinkDb,
  'id' | 'androidUrl' | 'iosUrl' | 'fallbackUrl' | 'appId' | 'disableIosPreviewPage'
>

type App = Pick<AppDb, 'androidUrl' | 'iosUrl' | 'fallbackUrl' | 'disableIosPreviewPage'>

export const clickMiddleware = async (req: NextRequest, event: NextFetchEvent) => {
  const domain = getDomain(req)

  const slug = req.nextUrl.pathname.split('/')[1]

  if (!slug) {
    return redirect(WWW_URL)
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
  ).data as Link

  if (!link) {
    return redirect(WWW_URL)
  }

  const clickId = crypto.randomUUID()

  let destinationUrl: URL

  const ua = userAgent(req)

  const isIos = ua.os?.name === 'iOS'
  const isAndroid = ua.os?.name === 'Android'

  if (isIos) {
    let iosUrl = link.iosUrl
    let disableIosPreviewPage = link.disableIosPreviewPage

    if (!iosUrl || disableIosPreviewPage === null) {
      const app = await getApp(supabase, link.appId)

      if (!app) {
        return redirect(WWW_URL)
      }

      iosUrl = link.iosUrl || app.iosUrl
      disableIosPreviewPage =
        link.disableIosPreviewPage === null ? app.disableIosPreviewPage : link.disableIosPreviewPage
    }

    destinationUrl = new URL(iosUrl)

    if (!disableIosPreviewPage && isStoreUrl(iosUrl)) {
      destinationUrl = new URL(routes.IOS_PREVIEW.path, getWebDomain(true))
      destinationUrl.searchParams.append('click_id', clickId)
      destinationUrl.searchParams.append('app_id', link.appId)
      destinationUrl.searchParams.append('redirect', iosUrl)
    }
  } else if (isAndroid) {
    let androidUrl = link.androidUrl

    if (!androidUrl) {
      const app = await getApp(supabase, link.appId)

      if (!app) {
        return redirect(WWW_URL)
      }

      androidUrl = app.androidUrl
    }

    destinationUrl = new URL(androidUrl)

    if (isStoreUrl(androidUrl)) {
      destinationUrl.searchParams.append('launch', 'true') // If the user has the app installed, it will open the app instead of redirecting to the Play Store
      destinationUrl.searchParams.append('referrer', `advents_click_id=${clickId}`)
    }
  } else {
    let fallbackUrl = link.fallbackUrl

    if (!fallbackUrl) {
      const app = await getApp(supabase, link.appId)

      if (!app) {
        return redirect(WWW_URL)
      }

      fallbackUrl = app.fallbackUrl
    }

    destinationUrl = new URL(fallbackUrl)
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

  const isDevLinkDomain = domain.endsWith('.localhost:3000')

  if (isDevLinkDomain) {
    domain = domain.replace('.localhost:3000', '')
  }

  return domain
}

const getWebDomain = (withProtocol: boolean) => {
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

const getApp = async (supabase: SupabaseClient, appId: string): Promise<App | null> => {
  return (
    await supabase
      .from('apps')
      .select(
        `
      androidUrl:android_url,
      iosUrl:ios_url,
      disableIosPreviewPage:disable_ios_preview_page,
      fallbackUrl:fallback_url
      `,
      )
      .eq('id', appId)
      .limit(1)
      .single()
  ).data as App
}
