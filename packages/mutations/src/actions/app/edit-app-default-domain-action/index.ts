'use server'

import { prisma } from '@advents/db'
import { getAppDomains } from '@advents/queries/server'
import { z } from 'zod'

import { ActionError } from '../../../action-errors'
import { authActionClient } from '../../../safe-action'
import { editAppDefaultDomainFormInputSchema } from './schema'

const inputSchema = editAppDefaultDomainFormInputSchema.extend({
  teamSlug: z.string({ message: 'Slug da equipe inválido.' }),
  appSlug: z.string({ message: 'Slug do app inválido.' }),
})

export const editAppDefaultDomainAction = authActionClient
  .schema(inputSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { teamSlug, appSlug, defaultDomain } = parsedInput

    const app = await prisma.app.findFirst({
      where: {
        slug: appSlug,
        team: {
          slug: teamSlug,
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

    if (!availableDomains.some(domain => domain.domain === defaultDomain)) {
      throw new ActionError('Domínio inválido.')
    }

    await prisma.app.update({
      where: {
        id: app.id,
      },
      data: {
        defaultDomain,
        updatedBy: user.id,
      },
    })
  })
