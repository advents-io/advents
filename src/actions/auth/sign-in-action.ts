'use server'

import { headers } from 'next/headers'

import { actionClient, ActionError } from '@/actions/safe-action'
import { signInInputSchema } from '@/actions/schemas/input/auth/sign-in-input'
import { supabaseClient } from '@/lib/supabase'
import { LOCALHOST_APP_ORIGIN } from '@/utils/constants'

export const signInAction = actionClient
  .schema(signInInputSchema)
  .action(async ({ parsedInput }) => {
    const { email } = parsedInput

    const supabase = supabaseClient()

    const headersList = headers()
    const origin = headersList.get('origin') || LOCALHOST_APP_ORIGIN

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${origin}/api/auth/confirm`,
      },
    })

    if (error) {
      throw new ActionError(
        error.code === 'otp_disabled' ? 'E-mail não cadastrado.' : error.message,
      )
    }
  })
