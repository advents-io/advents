import { z } from 'zod'

import { LINK_DOMAINS } from '@/utils/constants'
import { regexes } from '@/utils/regexes'

const [first, ...rest] = LINK_DOMAINS

export const createLinkInputFormSchema = z.object({
  title: z.string().max(50, 'O título deve possuir no máximo 50 caracteres.').nullish(),
  domain: z.enum([first, ...rest], { message: 'Domínio inválido.' }),
  slug: z
    .string()
    .max(20, 'A chave do link curto deve possuir no máximo 20 caracteres.')
    .regex(
      regexes.CASE_INSENSITIVE_SLUG,
      'A chave do link deve conter apenas letras, números, hifen ou underline.',
    )
    .optional(),
  androidUrl: z.string({ message: 'Url inválida.' }).url('Url inválida.'),
  iosUrl: z.string({ message: 'Url inválida.' }).url('Url inválida.'),
  fallbackUrl: z.string({ message: 'Url inválida.' }).url('Url inválida.'),
})

export const createLinkInputActionSchema = createLinkInputFormSchema.extend({
  appId: z.string({ message: 'Id do app inválido.' }).uuid('Id do app inválido.'),
})

export type CreateLinkInputFormProps = z.infer<typeof createLinkInputFormSchema>
