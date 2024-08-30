import { z } from 'zod'

export const signUpInputSchema = z.object({
  email: z.string({ message: 'E-mail inválido.' }).email('E-mail inválido.'),
  password: z.string({ message: 'Senha é obrigatória.' }).min(1, 'Senha é obrigatória.'),
})
