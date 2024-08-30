import { z } from 'zod'

import { createLinkInputSchema } from './create-link-input'

export const editLinkInputSchema = createLinkInputSchema.extend({
  linkId: z
    .string({ message: 'Id do link em formato inválido.' })
    .uuid('Id do link em formato inválido.'),
})
