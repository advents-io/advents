import { z } from 'zod'

export const editAppDomainConfigFormInputSchema = z.object({
  defaultDomain: z.string({ message: 'Domínio inválido.' }),
  subDomain: z
    .string({ message: 'Sub-domínio inválido.' })
    .min(1, 'Sub-domínio inválido.')
    .max(48, 'O sub-domínio deve possuir no máximo 48 caracteres.')
    .regex(
      /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/,
      'O sub-domínio deve conter apenas letras minúsculas, números e hífen. Não pode começar ou terminar com hífen.',
    ),
})

export type EditAppDomainConfigFormInput = z.infer<typeof editAppDomainConfigFormInputSchema>
