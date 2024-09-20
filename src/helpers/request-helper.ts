import { Geo, geolocation, ipAddress } from '@vercel/functions'

const LOCALHOST_GEO_DATA: Geo = {
  country: 'BR',
  city: 'Joinville',
  region: 'SC',
  latitude: '-26.2362',
  longitude: '-48.8824',
}

export const getGeoData = (req: Request) => {
  const ip = process.env.VERCEL === '1' ? ipAddress(req) : '127.0.0.1'
  const continent = process.env.VERCEL === '1' ? req.headers.get('x-vercel-ip-continent') : 'SA'
  const geo = process.env.VERCEL === '1' ? geolocation(req) : LOCALHOST_GEO_DATA

  return {
    ip: typeof ip === 'string' && ip.trim().length > 0 ? ip : '',
    continent: continent || 'Unknown',
    country: geo?.country || 'Unknown',
    city: geo?.city || 'Unknown',
    region: geo?.countryRegion || 'Unknown',
    latitude: geo?.latitude || 'Unknown',
    longitude: geo?.longitude || 'Unknown',
  }
}
