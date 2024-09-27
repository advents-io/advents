'use server'

import { fetchUrlOgImage, routes } from '@advents/common'
import { prisma } from '@advents/db'
import { redirect } from 'next/navigation'

import { ActionError } from '@/actions/action-errors'
import { authActionClient } from '@/actions/safe-action'
import { createAppInputSchema } from '@/actions/schemas/input/app/create-app-input'
import { nanoid } from '@/lib/nanoid'

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

    const imageUrl = await fetchUrlOgImage(app.androidUrl)

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
          },
        },
        teamId: team.id,
        createdBy: user.id,
        updatedBy: user.id,
      },
    })

    redirect(routes.LINKS.path(team.slug, app.slug))
  })
