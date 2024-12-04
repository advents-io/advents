import { nanoid } from '@advents/common'
import { prisma } from '@advents/db'

export const generateRandomSlug = async (domain: string): Promise<string> => {
  const slug = nanoid()

  const linkExists = await prisma.link.findUnique({
    where: {
      domain_slug: {
        domain,
        slug,
      },
    },
    select: {
      id: true,
    },
  })

  if (linkExists) {
    return await generateRandomSlug(domain)
  }

  return slug
}
