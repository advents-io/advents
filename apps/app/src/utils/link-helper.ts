import { prisma } from '@advents/db'

import { nanoid } from '@/lib/nanoid'

export const generateRandomSlug = async (domain: string): Promise<string> => {
  const slug = nanoid()

  const linkExists = await prisma.link.findUnique({
    select: { id: true },
    where: {
      domain_slug: {
        domain,
        slug,
      },
    },
  })

  if (linkExists) {
    return await generateRandomSlug(domain)
  }

  return slug
}
