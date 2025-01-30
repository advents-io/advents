'use server'

import { prisma } from '@advents/db'
import { z } from 'zod'

import { ActionError } from '../../action-errors'
import { authActionClient } from '../../safe-action'

const inputSchema = z.object({
  appId: z.string(),
  enableIosUniversalLinks: z.boolean(),
  iosBundleIds: z
    .array(
      z.object({
        id: z.string().nullable(),
        bundleId: z.string(),
      }),
    )
    .transform(value => value.filter(item => item.bundleId)),
  appleTeamId: z.string().nullable(),
})

export const editIosUniversalLinksAction = authActionClient
  .schema(inputSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { appId, enableIosUniversalLinks, iosBundleIds, appleTeamId } = parsedInput

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

    const idsToNotDelete = iosBundleIds.filter(bundle => bundle.id).map(bundle => bundle.id!)

    await prisma.app.update({
      where: {
        id: app.id,
      },
      data: {
        enableIosUniversalLinks,
        appleTeamId,
        iosBundleIds: {
          deleteMany: {
            NOT: {
              id: {
                in: idsToNotDelete,
              },
            },
          },
          upsert: iosBundleIds.map(({ id, bundleId }) => ({
            where: {
              id: id || '',
            },
            create: {
              bundleId,
              createdBy: user.id,
              updatedBy: user.id,
            },
            update: {
              bundleId,
              updatedBy: user.id,
            },
          })),
        },
      },
    })
  })
