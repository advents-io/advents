import { z } from 'zod'

import { regexes } from '../../../utils/regexes'

export const createEditLinkFormInputSchema = z.object({
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
  androidUrl: z
    .string({ message: 'Url inválida.' })
    .url('Url inválida.')
    .nullable()
    .or(z.literal(''))
    .transform(value => value || null),
  iosUrl: z
    .string({ message: 'Url inválida.' })
    .url('Url inválida.')
    .nullable()
    .or(z.literal(''))
    .transform(value => value || null),
  disableIosPreviewPage: z.boolean().nullable(),
  fallbackUrl: z
    .string({ message: 'Url inválida.' })
    .url('Url inválida.')
    .nullable()
    .or(z.literal(''))
    .transform(value => value || null),
  campaignCost: z
    .number({ message: 'Custo da campanha inválido.' })
    .min(0.01, 'O custo da campanha deve ser maior que zero.')
    .nullable()
    .transform(value => value || null),
})

export const inputSchema = createEditLinkFormInputSchema.extend({
  appId: z.string({ message: 'Id do app inválido.' }).uuid('Id do app inválido.'),
})
