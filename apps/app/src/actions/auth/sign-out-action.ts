'use server'

import { redirect } from 'next/navigation'

import { authActionClient } from '@/actions/safe-action'
import { routes } from '@/utils/routes'

export const signOutAction = authActionClient.action(async ({ ctx: { supabase } }) => {
  await supabase.auth.signOut()

  return redirect(routes.SIGN_IN.path)
})
