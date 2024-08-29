import { type NextRequest, NextResponse } from 'next/server'

export const authMiddleware = async (req: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  return response
}
