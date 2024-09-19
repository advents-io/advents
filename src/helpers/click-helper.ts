import { Click } from '@prisma/client'
import { ipAddress } from '@vercel/functions'
import { NextRequest, userAgent } from 'next/server'

import { supabaseClient } from '@/lib/supabase'

const LOCALHOST_GEO_DATA = {
  continent: 'SA',
  country: 'BR',
  city: 'Joinville',
  region: 'SC',
  latitude: '-26.2362',
  longitude: '-48.8824',
}

const LOCALHOST_IP = '127.0.0.1'

interface ClickInsert extends Omit<Click, 'createdAt'> {}

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

  const ip = process.env.VERCEL === '1' ? ipAddress(req) : LOCALHOST_IP
  const continent =
    process.env.VERCEL === '1'
      ? req.headers.get('x-vercel-ip-continent')
      : LOCALHOST_GEO_DATA.continent
  const geo = process.env.VERCEL === '1' ? req.geo : LOCALHOST_GEO_DATA
  const ua = userAgent(req)
  const referer = req.headers.get('referer')
  const refererDomain = getDomainFromUrl(referer)

  const click: ClickInsert = {
    id: clickId,

    linkId,

    destinationUrl,
    os: ua.os.name || 'Unknown',
    referer: refererDomain || '(direct)',
    refererUrl: referer || '(direct)',
    ip: typeof ip === 'string' && ip.trim().length > 0 ? ip : '',
    continent: continent || 'Unknown',
    country: geo?.country || 'Unknown',
    city: geo?.city || 'Unknown',
    region: geo?.region || 'Unknown',
    latitude: geo?.latitude || 'Unknown',
    longitude: geo?.longitude || 'Unknown',
    device: ua.device.type || 'Desktop',
    deviceVendor: ua.device.vendor || 'Unknown',
    deviceModel: ua.device.model || 'Unknown',
    browser: ua.browser.name || 'Unknown',
    browserVersion: ua.browser.version || 'Unknown',
    engine: ua.engine.name || 'Unknown',
    engineVersion: ua.engine.version || 'Unknown',
    osVersion: ua.os.version || 'Unknown',
    cpuArchitecture: ua.cpu?.architecture || 'Unknown',
    userAgent: ua.ua || 'Unknown',
    isBot: ua.isBot,
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
