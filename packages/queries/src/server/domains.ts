export const APP_DOMAIN = 'https://app.advents.io'
export const APP_LOCALHOST_DOMAIN = 'http://localhost:3000'

type LinkCustomDomain = {
  appId: string
  domain: string
}

const LINK_DEFAULT_DOMAINS = ['adv.sh']

// TODO: Workaround to work with cumbuca app, will be removed in the future
const LINK_CUSTOM_DOMAINS: LinkCustomDomain[] = [
  {
    appId: 'eb39be27-f842-4eca-97d2-1835bfc4e33a',
    domain: 'links.cumbuca.com',
  },
]

export const LINK_DEFAULT_DOMAIN = LINK_DEFAULT_DOMAINS[0]
export const LINK_LOCALHOST_DOMAIN = 'l.localhost:3000'

export const getLinkDomains = async (appId?: string): Promise<string[]> => {
  const customDomains = appId
    ? LINK_CUSTOM_DOMAINS.filter(customDomain => customDomain.appId === appId).map(
        customDomain => customDomain.domain,
      )
    : []

  const domains = [...LINK_DEFAULT_DOMAINS, ...customDomains]

  return domains
}
