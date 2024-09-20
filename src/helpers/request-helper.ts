import { ipAddress } from '@vercel/functions'
import { NextRequest } from 'next/server'

const LOCALHOST_GEO_DATA = {
  continent: 'SA',
  country: 'BR',
  city: 'Joinville',
  region: 'SC',
  latitude: '-26.2362',
  longitude: '-48.8824',
}

const LOCALHOST_IP = '127.0.0.1'

export const getGeoData = (req: NextRequest) => {
  const ip = process.env.VERCEL === '1' ? ipAddress(req) : LOCALHOST_IP
  const continent =
    process.env.VERCEL === '1'
      ? req.headers.get('x-vercel-ip-continent')
      : LOCALHOST_GEO_DATA.continent
  const geo = process.env.VERCEL === '1' ? req.geo : LOCALHOST_GEO_DATA

  return {
    ip: typeof ip === 'string' && ip.trim().length > 0 ? ip : '',
    continent: continent || 'Unknown',
    country: geo?.country || 'Unknown',
    city: geo?.city || 'Unknown',
    region: geo?.region || 'Unknown',
    latitude: geo?.latitude || 'Unknown',
    longitude: geo?.longitude || 'Unknown',
  }
}
