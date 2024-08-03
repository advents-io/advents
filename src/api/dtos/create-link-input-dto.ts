import { z } from 'zod'

export const createLinkInputSchema = z.object({
  slug: z
    .string()
    .max(20, 'A chave do link curto deve possuir no máximo 20 caracteres.')
    .optional(),
  androidUrl: z
    .string({ message: 'Campo obrigatório.' })
    .url('Url inválida.')
    .includes('play.google.com'),
  iosUrl: z
    .string({ message: 'Campo obrigatório.' })
    .url('Url inválida.')
    .includes('apps.apple.com'),
  fallbackUrl: z.string({ message: 'Campo obrigatório.' }).url(),
})

export type CreateLinkInputProps = z.infer<typeof createLinkInputSchema>
