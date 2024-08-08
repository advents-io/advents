import { NextResponse } from 'next/server'

import { ErrorResponse } from '@/http/error-handler'

function badRequest(body: ErrorResponse): NextResponse<ErrorResponse> {
  return NextResponse.json<ErrorResponse>(body, { status: 400 })
}

export { badRequest }
