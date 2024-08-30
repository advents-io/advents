'use server'

import { actionClient, ActionError } from '@/actions/safe-action'
import { resetPasswordInputSchema } from '@/actions/schemas/input/auth/reset-password-input'
import { supabaseClient } from '@/lib/supabase'

export const resetPasswordAction = actionClient
  .schema(resetPasswordInputSchema)
  .action(async ({ parsedInput }) => {
    const { password, confirmPassword } = parsedInput

    if (password !== confirmPassword) {
      throw new ActionError('Senhas não conferem.')
    }

    const supabase = supabaseClient()

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      throw new ActionError('Não foi possível atualizar a senha.')
    }

    // TODO adicionar um toast 'Password updated'
  })
