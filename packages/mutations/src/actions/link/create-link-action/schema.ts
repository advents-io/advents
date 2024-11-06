import { LINK_DOMAINS } from '@advents/common'
import { z } from 'zod'

import { regexes } from '../../../utils/regexes'

const [first, ...rest] = LINK_DOMAINS

export const createLinkFormInputSchema = z.object({
  title: z
    .string()
    .max(50, 'O título deve possuir no máximo 50 caracteres.')
    .nullable()
    .transform(value => value || null),
  domain: z.enum([first, ...rest], { message: 'Domínio inválido.' }),
  slug: z
    .string()
    .max(20, 'A chave do link curto deve possuir no máximo 20 caracteres.')
    .regex(
      regexes.CASE_INSENSITIVE_SLUG,
      'A chave do link deve conter apenas letras, números, hífen ou underline.',
    )
    .optional()
    .transform(value => value || undefined),
  androidUrl: z.string({ message: 'Url inválida.' }).url('Url inválida.'),
  iosUrl: z.string({ message: 'Url inválida.' }).url('Url inválida.'),
  fallbackUrl: z.string({ message: 'Url inválida.' }).url('Url inválida.'),
  campaignCost: z
    .number({ message: 'Custo da campanha inválido.' })
    .min(0.01, 'O custo da campanha deve ser maior que zero.')
    .nullable()
    .transform(value => value || null),
})

export const inputSchema = createLinkFormInputSchema.extend({
  appId: z.string({ message: 'Id do app inválido.' }).uuid('Id do app inválido.'),
})

export type CreateLinkFormInput = z.infer<typeof createLinkFormInputSchema>
