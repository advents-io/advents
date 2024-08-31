'use server'

import { actionClient, ActionError } from '@/actions/safe-action'
import { signInInputSchema } from '@/actions/schemas/input/auth/sign-in-input'
import { supabaseClient } from '@/lib/supabase'

export const signInAction = actionClient
  .schema(signInInputSchema)
  .action(async ({ parsedInput }) => {
    const { email } = parsedInput

    const supabase = supabaseClient()

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    })

    if (error) {
      throw new ActionError(
        error.code === 'otp_disabled' ? 'E-mail não cadastrado.' : error.message,
      )
    }
  })
