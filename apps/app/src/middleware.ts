import { routes } from '@advents/common'
import { clickMiddleware, isLinkDomain } from '@advents/engine'
import { supabaseMiddleware } from '@advents/supabase/server'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - /ios/click
     * - /api
     */
    '/((?!_next/static|_next/image|favicon.ico|ios/click|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  if (isLinkDomain(req)) {
    return await clickMiddleware(req, event)
  }

  return await authMiddleware(req)
}

const authMiddleware = async (req: NextRequest) => {
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
