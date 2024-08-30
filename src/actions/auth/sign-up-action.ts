'use server'

import { headers } from 'next/headers'

import { actionClient, ActionError } from '@/actions/safe-action'
import { signUpInputSchema } from '@/actions/schemas/input/auth/sign-up-input'
import { supabaseClient } from '@/lib/supabase'

export const signUpAction = actionClient
  .schema(signUpInputSchema)
  .action(async ({ parsedInput }) => {
    const { email, password } = parsedInput

    const origin = headers().get('origin')

    const supabase = supabaseClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      throw new ActionError(error.message)
    }

    // TODO adicionar um toast 'Thanks for signing up! Please check your email for a verification link.',
  })
