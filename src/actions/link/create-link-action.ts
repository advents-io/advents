'use server'

import { ActionError, authActionClient } from '@/actions/safe-action'
import { createLinkInputActionSchema } from '@/actions/schemas/input/link/create-link-input'
import { generateRandomSlug } from '@/helpers/link-helper'
import { prisma } from '@/lib/prisma'

export const createLinkAction = authActionClient
  .schema(createLinkInputActionSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { title, domain, slug: reqSlug, iosUrl, androidUrl, fallbackUrl, appId } = parsedInput

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
        appId,
        createdBy: user.id,
        updatedBy: user.id,
      },
    })
  })
