import { LINK_DOMAINS } from '@advents/common'
import { z } from 'zod'

import { regexes } from '../../../utils/regexes'

const [first, ...rest] = LINK_DOMAINS

export const createAppInputSchema = z.object({
  name: z
    .string({ message: 'Nome do app é obrigatório.' })
    .min(1, 'Nome do app é obrigatório.')
    .max(200, 'O nome do app deve possuir no máximo 200 caracteres.'),
  slug: z
    .string({ message: 'Slug do app é obrigatório.' })
    .min(1, 'Slug do app é obrigatório.')
    .max(100, 'O Slug do app deve possuir no máximo 100 caracteres.')
    .regex(
      regexes.LOWER_CASE_SLUG,
      'O Slug do app deve conter apenas letras minusculas, números, hífen ou underline.',
    ),
  defaultDomain: z.enum([first, ...rest], { message: 'Domínio inválido.' }),
  androidUrl: z
    .string({ message: 'Url inválida.' })
    .url('Url inválida.')
    .includes('play.google.com', {
      message: 'A url do app Android deve ser da Google Play Store.',
    }),
  iosUrl: z.string({ message: 'Url inválida.' }).url('Url inválida.').includes('apps.apple.com', {
    message: 'A url do app iOS deve ser da App Store.',
  }),
  defaultFallbackUrl: z
    .string({ message: 'Url inválida.' })
    .url('Url inválida.')
    .nullish()
    .or(z.literal(''))
    .transform(value => value || null),
  qrcodeLogoUrl: z
    .string({ message: 'Url inválida.' })
    .url('Url inválida.')
    .nullish()
    .or(z.literal(''))
    .transform(value => value || null),
})

export type CreateAppInputProps = z.infer<typeof createAppInputSchema>
