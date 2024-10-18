import { clickMiddleware, isLinkDomain } from '@advents/engine'
import { NextFetchEvent, NextRequest } from 'next/server'

import { apiAuthMiddleware } from '@/middlewares/api-auth-middleware'
import { appAuthMiddleware } from '@/middlewares/app-auth-middleware'

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - /ios/click
     * - /api/auth/confirm
     * - /api/events
     */
    '/((?!_next/static|_next/image|favicon.ico|ios/click|api/auth/confirm|api/events|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  if (isLinkDomain(req)) {
    return await clickMiddleware(req, event)
  }

  const isApiRoute = req.nextUrl.pathname.startsWith('/api')

  if (isApiRoute) {
    return await apiAuthMiddleware(req)
  }

  return await appAuthMiddleware(req)
}
