type CustomDomain = {
  appId: string
  domain: string
}

type Domain = {
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

const CUSTOM_DOMAINS: CustomDomain[] = [
  {
    appId: 'eb39be27-f842-4eca-97d2-1835bfc4e33a',
    domain: 'links.cumbuca.com',
  },
  {
    appId: '07275def-37c3-4f2b-a049-bfee570dccc6',
    domain: 'li.favorito.digital',
  },
]

export const LOCALHOST_DOMAIN: string = 'l.localhost:3000'

export const getAppDomains = async (appId?: string): Promise<Domain[]> => {
  const customDomains: Domain[] = appId
    ? CUSTOM_DOMAINS.filter(customDomain => customDomain.appId === appId).map(customDomain => ({
        domain: customDomain.domain,
        type: 'custom',
      }))
    : []

  const domains = [...DEFAULT_DOMAINS, ...customDomains]

  return domains
}
