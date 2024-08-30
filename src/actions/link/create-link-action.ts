'use server'

import { actionClient, ActionError } from '@/actions/safe-action'
import { createLinkInputSchema } from '@/actions/schemas/input/link/create-link-input'
import { prisma } from '@/lib/prisma'
import { generateRandomSlug } from '@/utils/link-helper'

export const createLinkAction = actionClient
  .schema(createLinkInputSchema)
  .action(async ({ parsedInput }) => {
    const { title, domain, slug: reqSlug, iosUrl, androidUrl, fallbackUrl } = parsedInput

    if (reqSlug) {
      const linkExists = await prisma.link.findUnique({
        select: { id: true },
        where: {
          domain_slug: {
            domain,
            slug: reqSlug,
          },
        },
      })

      if (linkExists) {
        throw new ActionError(`Link duplicado.\n\nO link curto "${reqSlug}" já existe.`)
      }
    }

    const slug = reqSlug || (await generateRandomSlug(domain))

    await prisma.link.create({
      data: {
        title,
        domain,
        slug,
        iosUrl,
        androidUrl,
        fallbackUrl,
      },
    })
  })
