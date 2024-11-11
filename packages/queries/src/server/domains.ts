type LinkCustomDomain = {
  appId: string
  domain: string
}

const LINK_DEFAULT_DOMAINS: string[] =
  process.env.VERCEL === '1' && process.env.VERCEL_ENV === 'production'
    ? ['adv.sh']
    : ['dev.adv.sh']

export const LINK_DEFAULT_DOMAIN: string = LINK_DEFAULT_DOMAINS[0]

// TODO: Workaround to work with cumbuca app, will be removed in the future
const LINK_CUSTOM_DOMAINS: LinkCustomDomain[] = [
  {
    appId: 'eb39be27-f842-4eca-97d2-1835bfc4e33a',
    domain: 'links.cumbuca.com',
  },
  {
    appId: '07275def-37c3-4f2b-a049-bfee570dccc6',
    domain: 'li.favorito.digital',
  },
]

export const LINK_LOCALHOST_DOMAIN: string = 'l.localhost:3000'

export const getLinkDomains = async (appId?: string): Promise<string[]> => {
  const customDomains = appId
    ? LINK_CUSTOM_DOMAINS.filter(customDomain => customDomain.appId === appId).map(
        customDomain => customDomain.domain,
      )
    : []

  const domains = [...LINK_DEFAULT_DOMAINS, ...customDomains]

  return domains
}
