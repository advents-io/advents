import { Geo, geolocation, ipAddress } from '@vercel/functions'

const LOCALHOST_GEO_DATA: Geo = {
  country: 'BR',
  city: 'Joinville',
  region: 'SC',
  latitude: '-26.2362',
  longitude: '-48.8824',
}

interface GeoData {
  ip: string | null
  continent: string | null
  country: string | null
  city: string | null
  region: string | null
  latitude: string | null
  longitude: string | null
}

export const getGeoData = (req: Request): GeoData => {
  const ip = process.env.VERCEL === '1' ? ipAddress(req) : '127.0.0.1'
  const continent = process.env.VERCEL === '1' ? req.headers.get('x-vercel-ip-continent') : 'SA'
  const geo = process.env.VERCEL === '1' ? geolocation(req) : LOCALHOST_GEO_DATA

  return {
    ip: typeof ip === 'string' && ip.trim().length > 0 ? ip : null,
    continent,
    country: geo?.country || null,
    city: geo?.city || null,
    region: geo?.countryRegion || null,
    latitude: geo?.latitude || null,
    longitude: geo?.longitude || null,
  }
}
