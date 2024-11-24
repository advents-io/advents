import { z } from 'zod'

const MAX_FILE_SIZE = 2 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpg', 'image/jpeg']

export const editAppQrCodeLogoFormInputSchema = z.object({
  qrCodeLogoFile: z
    .instanceof(File, { message: 'Imagem inválida.' })
    .refine(file => file.size <= MAX_FILE_SIZE, {
      message: `O tamanho do arquivo deve ser menor que 2MB.`,
    })
    .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Apenas .png, .jpg e .jpeg são suportados.',
    }),
})

export type EditAppQrCodeLogoFormInput = z.infer<typeof editAppQrCodeLogoFormInputSchema>

export const inputSchema = editAppQrCodeLogoFormInputSchema.extend({
  appSlug: z.string({ message: 'Slug do app inválido.' }),
})
