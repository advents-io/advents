import { z } from 'zod'

export const forgotPasswordInputSchema = z.object({
  email: z.string().email('E-mail inválido.'),
  callbackUrl: z.string().url('URL de callback inválida.').optional(),
})
