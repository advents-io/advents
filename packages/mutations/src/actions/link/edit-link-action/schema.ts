import { z } from 'zod'

import { regexes } from '../../../utils/regexes'

export const inputSchema = z.object({
  linkId: z
    .string({ message: 'Id do link em formato inválido.' })
    .uuid('Id do link em formato inválido.'),
  title: z
    .string()
    .max(50, 'O título deve possuir no máximo 50 caracteres.')
    .nullable()
    .transform(value => value || null),
  domain: z.string({ message: 'Domínio inválido.' }),
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
