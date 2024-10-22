'use server'

import { LOCALHOST_APP_DOMAIN } from '@advents/common'
import { supabaseServer } from '@advents/supabase'
import { headers } from 'next/headers'

import { ActionError } from '../../action-errors'
import { actionClient } from '../../safe-action'
import { signInInputSchema } from '../../schemas/input/auth/sign-in-input'

export const signInAction = actionClient
  .schema(signInInputSchema)
  .action(async ({ parsedInput }) => {
    const { email } = parsedInput

    const supabase = supabaseServer()

    const headersList = await headers()
    const origin = headersList.get('origin') || LOCALHOST_APP_DOMAIN

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
