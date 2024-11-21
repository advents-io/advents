import { z } from 'zod'

export const addCustomDomainFormSchema = z.object({
  domain: z
    .string({ message: 'Domínio inválido.' })
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}$/, 'Formato de domínio inválido.'),
})

export type AddCustomDomainFormInput = z.infer<typeof addCustomDomainFormSchema>

export const inputSchema = addCustomDomainFormSchema.extend({
  appSlug: z.string({ message: 'Slug do app inválido.' }),
})
