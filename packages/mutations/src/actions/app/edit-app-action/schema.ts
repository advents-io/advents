import { z } from 'zod'

import { createAppInputSchema } from '../create-app-action/schema'

export const editAppFormInputSchema = createAppInputSchema.extend({
  defaultDomain: z.string({ message: 'Domínio inválido.' }),
  disableIosPreviewPage: z.boolean(),
})

export const inputSchema = editAppFormInputSchema.extend({
  id: z.string({ message: 'Id do app é obrigatório.' }).uuid('Id do app é obrigatório.'),
})

export type EditAppFormInput = z.infer<typeof editAppFormInputSchema>
