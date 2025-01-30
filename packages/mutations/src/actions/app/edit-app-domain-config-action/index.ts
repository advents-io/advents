'use server'

import { prisma } from '@advents/db'
import { getAppDomains } from '@advents/queries/server'
import { z } from 'zod'

import { ActionError } from '../../../action-errors'
import { authActionClient } from '../../../safe-action'
import { editAppDomainConfigFormInputSchema } from './schema'

const inputSchema = editAppDomainConfigFormInputSchema.extend({
  teamSlug: z.string({ message: 'Slug da equipe inválido.' }),
  appSlug: z.string({ message: 'Slug do app inválido.' }),
})

export const editAppDomainConfigAction = authActionClient
  .schema(inputSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { teamSlug, appSlug, defaultDomain, subDomain } = parsedInput

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
        subDomain: true,
      },
    })

    if (!app) {
      throw new ActionError('App não encontrado.')
    }

    const subDomainChanged = app.subDomain !== subDomain

    if (subDomainChanged) {
      const subDomainExists = await prisma.app.findUnique({
        where: {
          subDomain,
        },
        select: {
          id: true,
        },
      })

      if (subDomainExists) {
        throw new ActionError('Sub-domínio já utilizado por outro app.')
      }
    }

    const availableDomains = await getAppDomains(app.id)

    const defaultDomainIsAvailable = availableDomains.some(
      domain => domain.domain === defaultDomain,
    )

    if (!defaultDomainIsAvailable) {
      throw new ActionError('Domínio padrão inválido.')
    }

    await prisma.app.update({
      where: {
        id: app.id,
      },
      data: {
        defaultDomain,
        subDomain,
        updatedBy: user.id,
      },
    })
  })
