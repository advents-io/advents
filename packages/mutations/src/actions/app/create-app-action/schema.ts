import { z } from 'zod'

import { regexes } from '../../../utils/regexes'

export const createAppInputSchema = z.object({
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
  androidUrl: z
    .string({ message: 'Url inválida.' })
    .url('Url inválida.')
    .includes('play.google.com', {
      message: 'A url do app Android deve ser da Google Play Store.',
    }),
  iosUrl: z.string({ message: 'Url inválida.' }).url('Url inválida.').includes('apps.apple.com', {
    message: 'A url do app iOS deve ser da App Store.',
  }),
  fallbackUrl: z.string({ message: 'Url inválida.' }).url('Url inválida.'),
})

export type CreateAppInput = z.infer<typeof createAppInputSchema>
