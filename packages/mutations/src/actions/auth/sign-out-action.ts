'use server'

import { routes } from '@advents/common'
import { redirect } from 'next/navigation'

import { authActionClient } from '../../safe-action'

export const signOutAction = authActionClient.action(async ({ ctx: { supabase } }) => {
  await supabase.auth.signOut()

  return redirect(routes.SIGN_IN.path)
})
