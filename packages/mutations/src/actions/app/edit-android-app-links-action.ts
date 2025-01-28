'use server'

import { prisma } from '@advents/db'
import { z } from 'zod'

import { ActionError } from '../../action-errors'
import { authActionClient } from '../../safe-action'

const inputSchema = z.object({
  appId: z.string(),
  enableAndroidAppLinks: z.boolean(),
  androidCertFingerprints: z
    .array(
      z.object({
        id: z.string().nullable(),
        sha256Fingerprint: z.string(),
      }),
    )
    .transform(value => value.filter(item => item.sha256Fingerprint)),
})

export const editAndroidAppLinksAction = authActionClient
  .schema(inputSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { appId, enableAndroidAppLinks, androidCertFingerprints } = parsedInput

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
    })

    if (!app) {
      throw new ActionError('App não encontrado.')
    }

    const idsToNotDelete = androidCertFingerprints.filter(fp => fp.id).map(fp => fp.id!)

    await prisma.app.update({
      where: {
        id: appId,
      },
      data: {
        enableAndroidAppLinks,
        androidCertFingerprints: {
          deleteMany: {
            NOT: {
              id: {
                in: idsToNotDelete,
              },
            },
          },
          upsert: androidCertFingerprints.map(({ id, sha256Fingerprint }) => ({
            where: {
              id: id || '',
            },
            create: {
              sha256Fingerprint,
              createdBy: user.id,
              updatedBy: user.id,
            },
            update: {
              sha256Fingerprint,
              updatedBy: user.id,
            },
          })),
        },
      },
    })
  })
