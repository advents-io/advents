import { z } from 'zod'

export const signUpInputSchema = z.object({
  email: z.string().email('E-mail inválido.'),
  password: z.string(),
})
