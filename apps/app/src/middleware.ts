import { clickMiddleware, isLinkDomain } from '@advents/engine'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

import { authMiddleware } from '@/utils/auth-middleware'

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - /ios/click route
     */
    '/((?!_next/static|_next/image|favicon.ico|ios/click|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  if (isLinkDomain(req)) {
    return await clickMiddleware(req, event)
  }

  const isApiRoute = req.nextUrl.pathname.startsWith('/api')

  if (!isApiRoute) {
    return await authMiddleware(req)
  }

  return NextResponse.next()
}
