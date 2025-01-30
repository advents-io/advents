type CustomDomain = {
  appId: string
  domain: string
}

export type Domain = {
  domain: string
  type: 'default' | 'custom'
}

const DEFAULT_DOMAINS: Domain[] =
  process.env.NEXT_PUBLIC_VERCEL === '1' && process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? [
        {
          domain: 'adv.sh',
          type: 'default',
        },
      ]
    : [
        {
          domain: 'dev.adv.sh',
          type: 'default',
        },
      ]

export const DEFAULT_DOMAIN: string = DEFAULT_DOMAINS[0].domain

const CUSTOM_DOMAINS: CustomDomain[] =
  process.env.NEXT_PUBLIC_VERCEL === '1' && process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? [
        {
          appId: '07275def-37c3-4f2b-a049-bfee570dccc6',
          domain: 'li.favorito.digital',
        },
      ]
    : [
        {
          appId: 'bd356bbe-4861-4a8b-8b4f-de64999702e7', // Seed database app
          domain: 'links.favorito.digital',
        },
      ]

export const LOCALHOST_DOMAIN: string = 'l.localhost:3000'

export const getAppDomains = async (appId: string): Promise<Domain[]> => {
  const customDomains: Domain[] = CUSTOM_DOMAINS.filter(
    customDomain => customDomain.appId === appId,
  ).map(customDomain => ({
    domain: customDomain.domain,
    type: 'custom',
  }))

  const domains = [...DEFAULT_DOMAINS, ...customDomains]

  return domains
}
