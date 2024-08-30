import { z } from 'zod'

export const signInInputSchema = z.object({
  email: z.string().email('E-mail inválido.'),
  password: z.string(),
})
