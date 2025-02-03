import { prisma } from '@advents/db'
import { z } from 'zod'

const isProduction =
  process.env.NEXT_PUBLIC_VERCEL === '1' && process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

export const domainSchema = z.object({
  domain: z.string(),
  type: z.enum(['advents', 'custom']),
  isDefault: z.boolean(),
})

export type Domain = z.infer<typeof domainSchema>

export const BASE_ADVENTS_DOMAIN: string = isProduction ? '.adv.sh' : '.dev.adv.sh'

type CustomDomain = {
  appId: string
  domain: string
}

const CUSTOM_DOMAINS: CustomDomain[] = isProduction
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

export const getAppDomains = async (appId: string): Promise<Domain[]> => {
  const app = await prisma.app.findUnique({
    where: {
      id: appId,
    },
    select: {
      subDomain: true,
      defaultDomain: true,
    },
  })

  if (!app) {
    return []
  }

  const adventsDomain: Domain = {
    domain: app.subDomain + BASE_ADVENTS_DOMAIN,
    type: 'advents',
    isDefault: false,
  }

  const customDomains: Domain[] = CUSTOM_DOMAINS.filter(
    customDomain => customDomain.appId === appId,
  ).map(customDomain => ({
    domain: customDomain.domain,
    type: 'custom',
    isDefault: false,
  }))

  const domains: Domain[] = [adventsDomain, ...customDomains].map(domain => ({
    ...domain,
    isDefault: domain.domain === app.defaultDomain,
  }))

  return domains
}

export const getAppIdFromDomain = (domain: string): string | null => {
  const appId = CUSTOM_DOMAINS.find(customDomain => customDomain.domain === domain)
  return appId ? appId.appId : null
}
