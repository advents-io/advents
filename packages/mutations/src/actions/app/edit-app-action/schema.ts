import { z } from 'zod'

import { regexes } from '../../../utils/regexes'

export const editAppFormInputSchema = z.object({
  name: z
    .string({ message: 'Nome do app é obrigatório.' })
    .min(1, 'Nome do app é obrigatório.')
    .max(64, 'O nome do app deve possuir no máximo 64 caracteres.'),
  slug: z
    .string({ message: 'Slug do app é obrigatório.' })
    .min(1, 'Slug do app é obrigatório.')
    .max(48, 'O Slug do app deve possuir no máximo 48 caracteres.')
    .regex(
      regexes.LOWER_CASE_SLUG,
      'O Slug do app deve conter apenas letras minusculas, números, hífen ou underline.',
    ),
  defaultDomain: z.string({ message: 'Domínio inválido.' }),
  androidUrl: z
    .string({ message: 'Url inválida.' })
    .url('Url inválida.')
    .includes('play.google.com', {
      message: 'A url do app Android deve ser da Google Play Store.',
    }),
  iosUrl: z.string({ message: 'Url inválida.' }).url('Url inválida.').includes('apps.apple.com', {
    message: 'A url do app iOS deve ser da App Store.',
  }),
  defaultDisableIosPreviewPage: z.boolean().default(false),
  defaultFallbackUrl: z
    .string({ message: 'Url inválida.' })
    .url('Url inválida.')
    .nullish()
    .or(z.literal(''))
    .transform(value => value || null),
})

export const inputSchema = editAppFormInputSchema.extend({
  id: z.string({ message: 'Id do app é obrigatório.' }).uuid('Id do app é obrigatório.'),
})

export type EditAppFormInput = z.infer<typeof editAppFormInputSchema>
