'use server'

import { prisma } from '@advents/db'
import { getAppDomains } from '@advents/queries/server'
import { z } from 'zod'

import { ActionError } from '../../../action-errors'
import { authActionClient } from '../../../safe-action'
import { generateRandomSlug } from '../../../utils/link-helper'
import { createEditLinkFormInputSchema } from './schema'

const inputSchema = createEditLinkFormInputSchema.extend({
  appId: z.string({ message: 'Id do app inválido.' }).uuid('Id do app inválido.'),
})

export const createLinkAction = authActionClient
  .schema(inputSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { appId, ...link } = parsedInput

    const app = await prisma.app.findUnique({
      where: {
        id: appId,
        team: {
          members: {
            some: {
              userId: user.id,
            },
          },
        },
      },
      select: {
        id: true,
      },
    })

    if (!app) {
      throw new ActionError('App não encontrado.')
    }

    const availableDomains = await getAppDomains(app.id)

    if (!availableDomains.some(domain => domain.domain === link.domain)) {
      throw new ActionError('Domínio inválido.')
    }

    if (link.slug) {
      const linkExists = await prisma.link.findUnique({
        select: { id: true },
        where: {
          domain_slug: {
            domain: link.domain,
            slug: link.slug,
          },
        },
      })

      if (linkExists) {
        throw new ActionError(`Link duplicado.\n\nO link curto "${link.slug}" já existe.`)
      }
    }

    const slug = link.slug || (await generateRandomSlug(link.domain))

    return await prisma.link.create({
      data: {
        ...link,
        slug,
        appId,
        createdBy: user.id,
        updatedBy: user.id,
      },
    })
  })
