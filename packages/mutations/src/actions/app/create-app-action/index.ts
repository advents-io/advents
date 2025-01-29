'use server'

import {
  getAndroidPackageNameFromStoreUrl,
  getUrlOgImage,
  nanoid,
  normalizeStoreUrl,
  routes,
} from '@advents/common'
import { prisma } from '@advents/db'
import { DEFAULT_DOMAIN } from '@advents/queries/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { ActionError } from '../../../action-errors'
import { authActionClient } from '../../../safe-action'
import { createAppInputSchema } from './schema'

const inputSchema = createAppInputSchema.extend({
  teamSlug: z.string({ message: 'Slug da equipe é obrigatório.' }),
})

export const createAppAction = authActionClient
  .schema(inputSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { teamSlug, ...app } = parsedInput

    const team = await prisma.team.findFirst({
      where: {
        slug: teamSlug,
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

    const normalizedIosUrl = normalizeStoreUrl(app.iosUrl)

    if (!normalizedIosUrl) {
      throw new ActionError('Url do app iOS inválida.')
    }

    app.iosUrl = normalizedIosUrl

    const normalizedAndroidUrl = normalizeStoreUrl(app.androidUrl)

    if (!normalizedAndroidUrl) {
      throw new ActionError('Url do app Android inválida.')
    }

    app.androidUrl = normalizedAndroidUrl

    const androidPackageName = getAndroidPackageNameFromStoreUrl(app.androidUrl)

    if (!androidPackageName) {
      throw new ActionError('Url do app Android inválida.')
    }

    const imageUrl = await getUrlOgImage(app.androidUrl)

    if (!imageUrl) {
      throw new ActionError('Erro ao buscar a imagem do app.')
    }

    const apiKey = `advents_${nanoid(24)}`

    await prisma.app.create({
      data: {
        ...app,
        defaultDomain: DEFAULT_DOMAIN,
        androidPackageName,
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
