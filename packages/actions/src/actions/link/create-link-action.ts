'use server'

import { prisma } from '@advents/db'

import { ActionError } from '../../action-errors'
import { authActionClient } from '../../safe-action'
import { createLinkInputActionSchema } from '../../schemas/input/link/create-link-input'
import { generateRandomSlug } from '../../utils/link-helper'

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
