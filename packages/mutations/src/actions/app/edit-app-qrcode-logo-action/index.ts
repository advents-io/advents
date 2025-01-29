'use server'

import { dayjs } from '@advents/common'
import { prisma } from '@advents/db'
import { getStorageFileUrl, supabaseServer } from '@advents/supabase/server'
import { z } from 'zod'

import { ActionError } from '../../../action-errors'
import { authActionClient } from '../../../safe-action'
import { editAppQrCodeLogoFormInputSchema } from './schema'

const inputSchema = editAppQrCodeLogoFormInputSchema.extend({
  appSlug: z.string({ message: 'Slug do app inválido.' }),
})

export const editAppQrCodeLogoAction = authActionClient
  .schema(inputSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { appSlug, qrCodeLogoFile: file } = parsedInput

    // TODO: user can be on multiple teams and app slug can repeat
    const app = await prisma.app.findFirst({
      where: {
        slug: appSlug,
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
        slug: true,
      },
    })

    if (!app) {
      throw new ActionError('App não encontrado.')
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase() || ''
    const timestamp = dayjs().format('YYMMDDHHmmssSSS')
    const fileName = `${timestamp}-${app.slug}.${fileExtension}`

    const supabase = await supabaseServer()

    const { data, error } = await supabase.storage.from('qrcode-logos').upload(fileName, file, {
      upsert: true,
    })

    if (error) {
      throw new ActionError('Erro ao enviar a logo do QR Code.')
    }

    const qrCodeLogoUrl = getStorageFileUrl('qrcode-logos', data.path)

    await prisma.app.update({
      where: {
        id: app.id,
      },
      data: {
        qrCodeLogoUrl,
        updatedBy: user.id,
      },
    })
  })
