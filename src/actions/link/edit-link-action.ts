'use server'

import { actionClient, ActionError } from '@/actions/safe-action'
import { editLinkInputSchema } from '@/actions/schemas/input/link/edit-link-input'
import { generateRandomSlug } from '@/helpers/link-helper'
import { prisma } from '@/lib/prisma'
import { supabaseClient } from '@/lib/supabase'

export const editLinkAction = actionClient
  .schema(editLinkInputSchema)
  .action(async ({ parsedInput }) => {
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

    const {
      data: { user },
    } = await supabaseClient().auth.getUser()

    if (!user) {
      throw new ActionError('Usuário não encontrado.')
    }

    const link = {
      ...originalLink,
      ...newLink,
      updatedBy: user.id,
    }

    await prisma.link.update({
      where: {
        id: linkId,
      },
      data: link,
    })
  })
