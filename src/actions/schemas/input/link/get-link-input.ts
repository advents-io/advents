import { z } from 'zod'

export const getLinkInputSchema = z.object({
  linkId: z
    .string({ message: 'Id do link em formato inválido.' })
    .uuid('Id do link em formato inválido.'),
})
