import { isStoreUrl, routes, WWW_URL } from '@advents/common'
import { App as AppDb, Link as LinkDb } from '@advents/db'
import { getAppIdFromCustomDomain } from '@advents/queries/server'
import { SupabaseClient, supabaseServer } from '@advents/supabase/server'
import { NextFetchEvent, NextRequest, NextResponse, userAgent } from 'next/server'

import { getRequestDomain, getWebDomain, RequestDomain } from '../utils/domain'
import { logClick } from './log-click'

type Link = Pick<
  LinkDb,
  'id' | 'androidUrl' | 'iosUrl' | 'fallbackUrl' | 'appId' | 'disableIosPreviewPage'
>

type App = Pick<AppDb, 'androidUrl' | 'iosUrl' | 'fallbackUrl' | 'disableIosPreviewPage'>

type Os = 'ios' | 'android' | 'unknown'

export const clickMiddleware = async (req: NextRequest, event: NextFetchEvent) => {
  const domain = getRequestDomain(req)

  const slug = req.nextUrl.pathname.split('/')[1]

  const ua = userAgent(req)
  const os = ua.os?.name === 'iOS' ? 'ios' : ua.os?.name === 'Android' ? 'android' : 'unknown'

  if (!slug) {
    return handleRequestWithoutSlug({
      domain,
      os,
    })
  }

  return handleRequestWithSlug({
    domain,
    slug,
    os,
    req,
    event,
  })
}

const handleRequestWithSlug = async ({
  slug,
  domain,
  os,
  req,
  event,
}: {
  slug: string
  domain: RequestDomain
  os: Os
  req: NextRequest
  event: NextFetchEvent
}): Promise<NextResponse> => {
  const supabase = await supabaseServer()

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
      .eq('domain', domain.domain)
      .limit(1)
      .single()
  ).data as Link

  if (!link) {
    return redirect(WWW_URL)
  }

  const clickId = crypto.randomUUID()

  let destinationUrl: URL

  if (os === 'ios') {
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
  } else if (os === 'android') {
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

const handleRequestWithoutSlug = async ({
  domain,
  os,
}: {
  domain: RequestDomain
  os: Os
}): Promise<NextResponse> => {
  const supabase = await supabaseServer()

  const subDomain = domain.isAdventsSubDomain ? domain.domain.split('.')[0] : null
  const appId = !subDomain ? getAppIdFromCustomDomain(domain.domain) : null

  const app = (
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
      .eq(subDomain ? 'subDomain' : 'id', subDomain || appId)
      .limit(1)
      .single()
  ).data as App

  if (!app) {
    return redirect(WWW_URL)
  }

  if (os === 'ios') {
    return redirect(app.iosUrl)
  } else if (os === 'android') {
    return redirect(app.androidUrl)
  } else {
    return redirect(app.fallbackUrl)
  }
}

const redirect = (url: string) => {
  return NextResponse.redirect(url, {
    status: 307,
  })
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
