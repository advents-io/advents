import { routes } from '@advents/common'
import { supabaseMiddleware } from '@advents/supabase'
import { type NextRequest, NextResponse } from 'next/server'

export const appAuthMiddleware = async (req: NextRequest) => {
  const { supabase, response } = supabaseMiddleware(req)

  const user = await supabase.auth.getUser()

  const isPrivateRoute = getIsPrivateRoute(req.nextUrl.pathname)

  if (isPrivateRoute && user.error) {
    return NextResponse.redirect(new URL(routes.SIGN_IN.path, req.url))
  }

  if (!isPrivateRoute && !user.error) {
    return NextResponse.redirect(new URL(routes.TEAMS.path, req.url))
  }

  return response
}

const getIsPrivateRoute = (path: string) => {
  const publicRoutes = [routes.SIGN_IN.path, routes.IOS_CLICK.path]

  return !publicRoutes.includes(path)
}
