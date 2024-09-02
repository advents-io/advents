import { z } from 'zod'

import { createLinkInputFormSchema } from './create-link-input'

export const editLinkInputSchema = createLinkInputFormSchema.extend({
  linkId: z
    .string({ message: 'Id do link em formato inválido.' })
    .uuid('Id do link em formato inválido.'),
})
