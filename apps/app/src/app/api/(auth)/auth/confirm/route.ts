import { supabaseClient } from '@advents/supabase'
import { NextRequest, NextResponse } from 'next/server'

import { routes } from '@/utils/routes'

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url)
  const origin = requestUrl.origin
  const tokenHash = requestUrl.searchParams.get('token_hash')

  if (!tokenHash) {
    const errorMessage = 'Token inválido.'

    return NextResponse.redirect(
      `${origin}${routes.SIGN_IN.path}?error_description=${encodeURIComponent(errorMessage)}`,
    )
  }

  const supabase = supabaseClient()
  const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'magiclink' })

  if (error) {
    return NextResponse.redirect(
      `${origin}${routes.SIGN_IN.path}?error_description=${encodeURIComponent(error.message)}`,
    )
  }

  return NextResponse.redirect(`${origin}${routes.TEAMS.path}`)
}
