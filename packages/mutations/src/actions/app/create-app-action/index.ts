'use server'

import { getUrlOgImage, nanoid, routes } from '@advents/common'
import { prisma } from '@advents/db'
import { getLinkDomains } from '@advents/queries/server'
import { redirect } from 'next/navigation'

import { ActionError } from '../../../action-errors'
import { authActionClient } from '../../../safe-action'
import { createAppInputSchema } from './schema'

export const createAppAction = authActionClient
  .schema(createAppInputSchema)
  .action(async ({ parsedInput: app, ctx: { user } }) => {
    const team = await prisma.team.findFirst({
      where: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },
    })

    if (!team) {
      throw new ActionError('Equipe não encontrada.')
    }

    const availableDomains = await getLinkDomains()

    if (!availableDomains.includes(app.defaultDomain)) {
      throw new ActionError('Domínio inválido.')
    }

    const slugExists = await prisma.app.findUnique({
      where: {
        slug_teamId: {
          slug: app.slug,
          teamId: team.id,
        },
      },
    })

    if (slugExists) {
      throw new ActionError('Identificador único já utilizado por outro app na sua conta.')
    }

    const imageUrl = await getUrlOgImage(app.androidUrl)

    if (!imageUrl) {
      throw new ActionError('Erro ao buscar a imagem do app.')
    }

    const apiKey = `advents_${nanoid(24)}`

    await prisma.app.create({
      data: {
        ...app,
        imageUrl,
        apiKeys: {
          create: {
            key: apiKey,
            createdBy: user.id,
            updatedBy: user.id,
          },
        },
        teamId: team.id,
        createdBy: user.id,
        updatedBy: user.id,
      },
    })

    redirect(routes.LINKS.path(team.slug, app.slug))
  })
