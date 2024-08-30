import { z } from 'zod'

export const forgotPasswordInputSchema = z.object({
  email: z.string({ message: 'E-mail inválido.' }).email('E-mail inválido.'),
  callbackUrl: z.string({ message: 'URL de callback inválida.' }).url('URL de callback inválida.'),
})
