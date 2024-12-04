import { z } from 'zod'

import { regexes } from '../../../utils/regexes'

export const createLinkFormInputSchema = z.object({
  title: z
    .string()
    .max(64, 'O título deve possuir no máximo 64 caracteres.')
    .nullable()
    .transform(value => value || null),
  domain: z.string({ message: 'Domínio inválido.' }),
  slug: z
    .string()
    .max(32, 'A chave do link curto deve possuir no máximo 32 caracteres.')
    .regex(
      regexes.CASE_INSENSITIVE_SLUG,
      'A chave do link deve conter apenas letras, números, hífen ou underline.',
    )
    .nullable()
    .transform(value => value || null),
  androidUrl: z.string({ message: 'Url inválida.' }).url('Url inválida.'),
  iosUrl: z.string({ message: 'Url inválida.' }).url('Url inválida.'),
  disableIosPreviewPage: z.boolean().default(false),
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
