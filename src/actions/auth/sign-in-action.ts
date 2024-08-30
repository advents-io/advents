'use server'

import { redirect } from 'next/navigation'

import { actionClient, ActionError } from '@/actions/safe-action'
import { signInInputSchema } from '@/actions/schemas/input/auth/sign-in-input'
import { supabaseClient } from '@/lib/supabase'
import { routes } from '@/utils/routes'

export const signInAction = actionClient
  .schema(signInInputSchema)
  .action(async ({ parsedInput }) => {
    const { email, password } = parsedInput

    const supabase = supabaseClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new ActionError(error.message)
    }

    return redirect(routes.LINKS.path)
  })
