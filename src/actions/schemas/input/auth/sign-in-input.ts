import { z } from 'zod'

export const signInInputSchema = z.object({
  email: z.string({ message: 'E-mail inválido.' }).email('E-mail inválido.'),
})

export type SignInInputProps = z.infer<typeof signInInputSchema>
