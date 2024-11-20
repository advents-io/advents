'use server'

import { prisma } from '@advents/db'
import { getAppDomains } from '@advents/queries/server'

import { ActionError } from '../../../action-errors'
import { authActionClient } from '../../../safe-action'
import { generateRandomSlug } from '../../../utils/link-helper'
import { inputSchema } from './schema'

export const editLinkAction = authActionClient
  .schema(inputSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { linkId, ...newLink } = parsedInput

    const originalLink = await prisma.link.findUnique({
      where: {
        id: linkId,
        app: {
          team: {
            members: {
              some: {
                userId: user.id,
              },
            },
          },
        },
      },
    })

    if (!originalLink) {
      throw new ActionError('Link não encontrado.')
    }

    const availableDomains = await getAppDomains(originalLink.appId)

    if (!availableDomains.includes(newLink.domain)) {
      throw new ActionError('Domínio inválido.')
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

    const slug = newLink.slug || (await generateRandomSlug(newLink.domain))

    const link = {
      ...originalLink,
      ...newLink,
      slug,
    }

    return await prisma.link.update({
      where: {
        id: linkId,
      },
      data: {
        ...link,
        updatedBy: user.id,
      },
    })
  })
