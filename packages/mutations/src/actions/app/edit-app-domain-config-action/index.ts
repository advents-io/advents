'use server'

import { Prisma, prisma } from '@advents/db'
import { BASE_ADVENTS_DOMAIN, getAppDomains } from '@advents/queries/server'
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
    const {
      teamSlug,
      appSlug,
      defaultDomain: newDefaultDomain,
      subDomain: newSubDomain,
    } = parsedInput

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
        defaultDomain: true,
      },
    })

    if (!app) {
      throw new ActionError('App não encontrado.')
    }

    const oldSubDomain = app.subDomain
    const oldDefaultDomain = app.defaultDomain

    const subDomainChanged = oldSubDomain !== newSubDomain

    if (subDomainChanged) {
      const newSubDomainExists = await prisma.app.findUnique({
        where: {
          subDomain: newSubDomain,
        },
        select: {
          id: true,
        },
      })

      if (newSubDomainExists) {
        throw new ActionError('Sub-domínio já utilizado por outro app.')
      }
    }

    const defaultDomainChanged = oldDefaultDomain !== newDefaultDomain

    if (defaultDomainChanged) {
      const availableDomains = await getAppDomains(app.id)

      const newDefaultDomainIsAvailable = availableDomains.some(
        domain => domain.domain === newDefaultDomain,
      )

      if (!newDefaultDomainIsAvailable) {
        throw new ActionError('Domínio padrão inválido.')
      }
    }

    const oldDefaultDomainIsAdventsDomain = oldDefaultDomain === oldSubDomain + BASE_ADVENTS_DOMAIN

    const queriesToExecute: Prisma.PrismaPromise<unknown>[] = [
      prisma.app.update({
        where: {
          id: app.id,
        },
        data: {
          defaultDomain:
            subDomainChanged && oldDefaultDomainIsAdventsDomain
              ? newSubDomain + BASE_ADVENTS_DOMAIN
              : newDefaultDomain,
          subDomain: newSubDomain,
          updatedBy: user.id,
        },
      }),
    ]

    if (subDomainChanged) {
      queriesToExecute.push(
        prisma.link.updateMany({
          where: {
            domain: oldSubDomain + BASE_ADVENTS_DOMAIN,
          },
          data: {
            domain: newSubDomain + BASE_ADVENTS_DOMAIN,
            updatedBy: user.id,
          },
        }),
      )
    }

    await prisma.$transaction(queriesToExecute)
  })
