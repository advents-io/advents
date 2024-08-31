import { NextRequest, NextResponse } from 'next/server'

import { supabaseClient } from '@/lib/supabase'
import { routes } from '@/utils/routes'

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url)
  const origin = requestUrl.origin
  const tokenHash = requestUrl.searchParams.get('token_hash')

  if (!tokenHash) {
    return NextResponse.redirect(`${origin}${routes.SIGN_IN.path}`) // TODO: Redirect to sign in page with error
  }

  const supabase = supabaseClient()
  const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'magiclink' })

  if (error) {
    return NextResponse.redirect(`${origin}${routes.SIGN_IN.path}`) // TODO: Redirect to sign in page with error
  }

  return NextResponse.redirect(`${origin}${routes.LINKS.path}`)
}
