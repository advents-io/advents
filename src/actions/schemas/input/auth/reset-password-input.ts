import { z } from 'zod'

export const resetPasswordInputSchema = z
  .object({
    password: z.string({
      message: 'Senha é obrigatória.',
    }),
    confirmPassword: z.string({
      message: 'Confirmação de senha é obrigatória.',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não conferem.',
    path: ['confirmPassword'],
  })
