export const isLinkDomain = (req: Request) => {
  const requestDomain = getRequestDomain(req)
  const webDomain = getWebDomain(false)

  const isLinkDomain = requestDomain !== webDomain
  return isLinkDomain
}

export const getRequestDomain = (req: Request) => {
  let domain = (req.headers.get('host') as string).replace('www.', '').toLowerCase()

  const isDevLinkDomain = domain.endsWith('.localhost:3000')

  if (isDevLinkDomain) {
    domain = domain.replace('.localhost:3000', '')
  }

  return domain
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
