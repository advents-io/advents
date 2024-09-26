'use server'

import { prisma } from '@advents/db'

import { ActionError } from '@/actions/action-errors'
import { authActionClient } from '@/actions/safe-action'
import { editLinkInputSchema } from '@/actions/schemas/input/link/edit-link-input'
import { generateRandomSlug } from '@/helpers/link-helper'

export const editLinkAction = authActionClient
  .schema(editLinkInputSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { linkId, ...newLink } = parsedInput

    const originalLink = await prisma.link.findUnique({ where: { id: linkId } })

    if (!originalLink) {
      throw new ActionError('Link não encontrado.')
    }

    if (
      newLink.slug &&
      (originalLink.domain !== newLink.domain || originalLink.slug !== newLink.slug)
    ) {
      const newLinkExists = await prisma.link.findUnique({
        select: { id: true },
        where: {
          domain_slug: {
            domain: newLink.domain,
            slug: newLink.slug,
          },
        },
      })

      if (newLinkExists) {
        throw new ActionError(`Link duplicado.\n\nO link curto "${newLink.slug}" já existe.`)
      }
    }

    newLink.slug = newLink.slug || (await generateRandomSlug(newLink.domain))

    const link = {
      ...originalLink,
      ...newLink,
    }

    await prisma.link.update({
      where: {
        id: linkId,
      },
      data: {
        ...link,
        updatedBy: user.id,
      },
    })
  })
