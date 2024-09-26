import { Click as DbClick } from '@advents/db'
import { NextRequest, userAgent } from 'next/server'

import { getGeoData } from '@/helpers/request-helper'
import { supabaseClient } from '@/lib/supabase'

interface Click extends Omit<DbClick, 'createdAt'> {}

export const logClick = async (
  req: NextRequest,
  clickId: string,
  linkId: string,
  destinationUrl: string,
) => {
  const isBot = detectBot(req)

  if (isBot) {
    return null
  }

  const ua = userAgent(req)
  const referer = req.headers.get('referer')
  const refererDomain = getDomainFromUrl(referer)

  const geoData = getGeoData(req)

  const click: Click = {
    id: clickId,

    destinationUrl,
    os: ua.os.name || null,

    referer: refererDomain || '(direct)',
    refererUrl: referer || '(direct)',

    deviceType: ua.device.type || 'Desktop',
    deviceBrand: ua.device.vendor || null,
    deviceModel: ua.device.model || null,
    osVersion: ua.os.version || null,
    userAgent: ua.ua || null,
    browser: ua.browser.name || null,
    browserVersion: ua.browser.version || null,
    engine: ua.engine.name || null,
    engineVersion: ua.engine.version || null,
    cpuArchitecture: ua.cpu?.architecture || null,
    isBot: ua.isBot,

    ...geoData,

    linkId,
  }

  const clickSnakeCase = convertKeysToSnakeCase(click)

  const supabase = supabaseClient()

  await Promise.allSettled([
    await supabase.from('clicks').insert(clickSnakeCase),

    // Calls the Postgres function increment_link_clicks which updates the link by incrementing a click
    await supabase.rpc('increment_link_clicks', { link_id: linkId }),
  ])
}

const detectBot = (req: NextRequest) => {
  const url = req.nextUrl

  if (url.searchParams.get('bot')) {
    return true
  }

  const ua = req.headers.get('User-Agent')

  /* Note:
   * - bot is for most bots & crawlers
   * - ChatGPT is for ChatGPT
   * - facebookexternalhit is for Facebook crawler
   * - WhatsApp is for WhatsApp crawler
   * - MetaInspector is for https://metatags.io/
   * - Go-http-client/1.1 is a bot: https://user-agents.net/string/go-http-client-1-1
   * - iframely is for https://iframely.com/docs/about (used by Notion, Linear)
   */
  return (
    ua &&
    /bot|chatgpt|facebookexternalhit|WhatsApp|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex|MetaInspector|Go-http-client|iframely/i.test(
      ua,
    )
  )
}

const isValidUrl = (url: string) => {
  try {
    // eslint-disable-next-line no-new
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

const getDomainFromUrl = (url: string | null) => {
  if (!url) {
    return null
  }

  if (isValidUrl(url)) {
    return new URL(url).hostname.replace(/^www\./, '')
  }

  try {
    if (url.includes('.') && !url.includes(' ')) {
      return new URL(`https://${url}`).hostname.replace(/^www\./, '')
    }
  } catch {}

  return null
}

const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)

const convertKeysToSnakeCase = <T extends Record<string, unknown>>(obj: T) =>
  Object.fromEntries(Object.entries(obj).map(([key, value]) => [camelToSnakeCase(key), value]))
