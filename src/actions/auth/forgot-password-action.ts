'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { actionClient, ActionError } from '@/actions/safe-action'
import { forgotPasswordInputSchema } from '@/actions/schemas/input/auth/forgot-password-input'
import { supabaseClient } from '@/lib/supabase'
import { routes } from '@/utils/routes'

export const forgotPasswordAction = actionClient
  .schema(forgotPasswordInputSchema)
  .action(async ({ parsedInput }) => {
    const { email, callbackUrl } = parsedInput

    const origin = headers().get('origin')

    const supabase = supabaseClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?redirect_to=${routes.RESET_PASSWORD.path}`,
    })

    if (error) {
      throw new ActionError('Não foi possível resetar a senha.')
    }

    if (callbackUrl) {
      return redirect(callbackUrl)
    }

    // TODO adicionar um toast 'Check your email for a link to reset your password.',
  })
