'use server'

import { redirect } from 'next/navigation'

import { actionClient } from '@/actions/safe-action'
import { supabaseClient } from '@/lib/supabase'
import { routes } from '@/utils/routes'

export const signOutAction = actionClient.action(async () => {
  const supabase = supabaseClient()
  await supabase.auth.signOut()

  return redirect(routes.SIGN_IN.path)
})
