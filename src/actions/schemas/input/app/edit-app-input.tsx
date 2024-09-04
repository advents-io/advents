import { z } from 'zod'

import { createAppInputSchema } from './create-app-input'

export const editAppInputSchema = createAppInputSchema.extend({
  id: z.string({ message: 'Id do app é obrigatório.' }).uuid('Id do app é obrigatório.'),
})
