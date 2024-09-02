'use server'

import { actionClient, ActionError } from '@/actions/safe-action'
import { createLinkInputActionSchema } from '@/actions/schemas/input/link/create-link-input'
import { prisma } from '@/lib/prisma'
import { supabaseClient } from '@/lib/supabase'
import { generateRandomSlug } from '@/utils/link-helper'

export const createLinkAction = actionClient
  .schema(createLinkInputActionSchema)
  .action(async ({ parsedInput }) => {
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

    const {
      data: { user },
    } = await supabaseClient().auth.getUser()

    if (!user) {
      throw new ActionError('Usuário não encontrado.')
    }

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
