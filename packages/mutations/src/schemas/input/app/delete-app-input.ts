import { z } from 'zod'

export const deleteAppInputSchema = z.object({
  teamSlug: z.string({ message: 'Slug da equipe é obrigatório.' }),
  appSlug: z.string({ message: 'Slug do app em formato inválido.' }),
})
