import { z } from 'zod'

import { LINK_DOMAINS } from '@/utils/constants'

const [first, ...rest] = LINK_DOMAINS

export const createLinkInputSchema = z.object({
  domain: z.enum([first, ...rest], { message: 'Domínio inválido.' }),
  slug: z
    .string({ message: 'Campo obrigatório.' })
    .max(20, 'A chave do link curto deve possuir no máximo 20 caracteres.')
    .regex(
      /^[a-zA-Z0-9-_]*$/,
      'A chave do link deve conter apenas letras, números, hifens ou underline.',
    )
    .optional(),
  androidUrl: z
    .string({ message: 'Campo obrigatório.' })
    .url('Url inválida.')
    .includes('play.google.com', {
      message: 'A url do app Android deve ser da Google Play Store.',
    }),
  iosUrl: z
    .string({ message: 'Campo obrigatório.' })
    .url('Url inválida.')
    .includes('apps.apple.com', {
      message: 'A url do app iOS deve ser da App Store.',
    }),
  fallbackUrl: z.string({ message: 'Campo obrigatório.' }).url('Url inválida.'),
})

export type CreateLinkInputProps = z.infer<typeof createLinkInputSchema>
