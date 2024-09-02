import { NextRequest, NextResponse } from 'next/server'

import { authMiddleware } from '@/middlewares/auth-middleware'
import { isLinkDomain, linkMiddleware } from '@/middlewares/link-middleware'

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

export async function middleware(req: NextRequest) {
  if (isLinkDomain(req)) {
    return await linkMiddleware(req)
  }

  const isApiRoute = req.nextUrl.pathname.startsWith('/api')

  if (!isApiRoute) {
    return await authMiddleware(req)
  }

  return NextResponse.next()
}
