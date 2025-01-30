import { z } from 'zod'

export const editAppDefaultDomainFormInputSchema = z.object({
  defaultDomain: z.string({ message: 'Domínio inválido.' }),
})

export type EditAppDefaultDomainFormInput = z.infer<typeof editAppDefaultDomainFormInputSchema>
