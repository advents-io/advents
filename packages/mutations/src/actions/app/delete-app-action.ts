'use server'

import { routes } from '@advents/common'
import { prisma } from '@advents/db'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { ActionError } from '../../action-errors'
import { authActionClient } from '../../safe-action'

const inputSchema = z.object({
  id: z.string({ message: 'Id do app é obrigatório.' }).uuid('Id do app inválido.'),
})

export const deleteAppAction = authActionClient
  .schema(inputSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { id } = parsedInput

    const app = await prisma.app.findUnique({
      where: {
        id,
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
        team: {
          select: {
            slug: true,
          },
        },
      },
    })

    if (!app) {
      throw new ActionError('App não encontrado.')
    }

    await prisma.app.delete({
      where: {
        id: app.id,
      },
    })

    redirect(routes.APPS.path(app.team.slug))
  })
