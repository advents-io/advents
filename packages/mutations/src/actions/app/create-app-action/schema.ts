import { z } from 'zod'

import { regexes } from '../../../utils/regexes'

export const baseCreateAppInputSchema = z.object({
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
    })
    .startsWith('https://', { message: 'A url deve ser https.' })
    .startsWith('https://play.google.com/store/apps/details?', {
      message: 'Url da Play Store inválida.',
    })
    .includes('id=', {
      message: 'Url da Play Store inválida.',
    }),
  iosUrl: z
    .string({ message: 'Url inválida.' })
    .url('Url inválida.')
    .refine(url => url.includes('apps.apple.com') || url.includes('itunes.apple.com'), {
      message: 'A url do app iOS deve ser da App Store.',
    })
    .refine(url => url.startsWith('https://'), { message: 'A url deve ser https.' })
    .refine(
      url =>
        url.startsWith('https://apps.apple.com/') || url.startsWith('https://itunes.apple.com/'),
      { message: 'Url da App Store inválida.' },
    )
    .refine(url => url.includes('id'), { message: 'Url da App Store inválida.' }),
  fallbackUrl: z.string({ message: 'Url inválida.' }).url('Url inválida.'),
})

export const createAppFormInputSchema = baseCreateAppInputSchema.extend({
  subDomain: z
    .string({ message: 'Sub-domínio é obrigatório.' })
    .min(1, 'Sub-domínio é obrigatório.')
    .max(48, 'O sub-domínio deve possuir no máximo 48 caracteres.')
    .regex(
      /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/,
      'O sub-domínio deve conter apenas letras minúsculas, números e hífen. Não pode começar ou terminar com hífen.',
    ),
})

export type CreateAppFormInput = z.infer<typeof createAppFormInputSchema>
