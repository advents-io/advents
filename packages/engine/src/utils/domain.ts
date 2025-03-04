import { BASE_ADVENTS_DOMAIN } from '@advents/queries/server'

export const isLinkDomain = (req: Request) => {
  const { domain: requestDomain } = getRequestDomain(req)
  const webDomain = getWebDomain(false)

  const isLinkDomain = requestDomain !== webDomain
  return isLinkDomain
}

export type RequestDomain = {
  domain: string
  isAdventsSubDomain: boolean
}

export const getRequestDomain = (req: Request): RequestDomain => {
  let domain = (req.headers.get('host') as string).replace('www.', '').toLowerCase()

  const isDevLinkDomain = domain.endsWith('.localhost:3000')

  if (isDevLinkDomain) {
    domain = domain.replace('.localhost:3000', '')
  }

  return {
    domain,
    isAdventsSubDomain: domain.includes(BASE_ADVENTS_DOMAIN),
  }
}

export const getWebDomain = (withProtocol: boolean) => {
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
