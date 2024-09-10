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

const ALLOWED_SEARCH_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'ref',
]

interface ClickInsert extends Omit<Click, 'id' | 'createdAt'> {}

export const logClick = async (req: NextRequest, linkId: string, destinationUrl: string) => {
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
  const identityHash = await getIdentityHash(req)

  const click: ClickInsert = {
    identityHash,
    linkId,
    destinationUrl: cleanUrlSearchParams(req, destinationUrl),
    ip: typeof ip === 'string' && ip.trim().length > 0 ? ip : '',
    continent: continent || 'Unknown',
    country: geo?.country || 'Unknown',
    city: geo?.city || 'Unknown',
    region: geo?.region || 'Unknown',
    latitude: geo?.latitude || 'Unknown',
    longitude: geo?.longitude || 'Unknown',
    device: capitalize(ua.device.type) || 'Desktop',
    deviceVendor: ua.device.vendor || 'Unknown',
    deviceModel: ua.device.model || 'Unknown',
    browser: ua.browser.name || 'Unknown',
    browserVersion: ua.browser.version || 'Unknown',
    engine: ua.engine.name || 'Unknown',
    engineVersion: ua.engine.version || 'Unknown',
    os: ua.os.name || 'Unknown',
    osVersion: ua.os.version || 'Unknown',
    cpuArchitecture: ua.cpu?.architecture || 'Unknown',
    userAgent: ua.ua || 'Unknown',
    isBot: ua.isBot,
    referer: referer ? getDomainWithoutWWW(referer) || '(direct)' : '(direct)',
    refererUrl: referer || '(direct)',
  }

  const clickSnakeCase = convertKeysToSnakeCase(click)

  const supabase = supabaseClient()

  await Promise.allSettled([
    await supabase.from('clicks').insert(clickSnakeCase),

    // Chama a Postgres function increment_link_clicks que atualiza o link incrementando um click
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

/**
 * Combine IP + UA to create a unique identifier for the user (for deduplication)
 */
const getIdentityHash = async (req: Request) => {
  const ip = ipAddress(req) || LOCALHOST_IP
  const ua = userAgent(req)

  return await hashStringSHA256(`${ip}-${ua.ua}`)
}

const hashStringSHA256 = async (value: string) => {
  // Encode the string into bytes
  const encoder = new TextEncoder()
  const data = encoder.encode(value)

  // Hash the data with SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)

  // Convert the buffer to a hexadecimal string
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  return hashHex
}

const capitalize = (value?: string | null) => {
  if (!value || typeof value !== 'string') {
    return value
  }

  return value
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const cleanUrlSearchParams = (req: NextRequest, url: string) => {
  const finalUrl = new URL(url)

  const searchParams = req.nextUrl.searchParams

  if (searchParams.size === 0) {
    return finalUrl.toString()
  }

  for (const [key, value] of searchParams) {
    const isAllowedSearchParam = ALLOWED_SEARCH_PARAMS.includes(key)

    if (isAllowedSearchParam) {
      finalUrl.searchParams.set(key, value)
    }
  }

  return finalUrl.toString()
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

const getDomainWithoutWWW = (url: string) => {
  if (isValidUrl(url)) {
    return new URL(url).hostname.replace(/^www\./, '')
  }

  try {
    if (url.includes('.') && !url.includes(' ')) {
      return new URL(`https://${url}`).hostname.replace(/^www\./, '')
    }
  } catch {}
}

const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)

const convertKeysToSnakeCase = <T extends Record<string, unknown>>(obj: T) =>
  Object.fromEntries(Object.entries(obj).map(([key, value]) => [camelToSnakeCase(key), value]))
