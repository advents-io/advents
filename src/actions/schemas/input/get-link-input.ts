import { z } from 'zod'

export const getLinkInputSchema = z.object({
  linkId: z
    .string({ message: 'Id do link não informado.' })
    .uuid('Id do link em formato inválido.'),
})
