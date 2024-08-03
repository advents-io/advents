import { NextResponse } from 'next/server'

import { ErrorResponse } from '@/http/api-error-handler'

function internalServerError(body: ErrorResponse): NextResponse<ErrorResponse> {
  return NextResponse.json<ErrorResponse>(body, { status: 500 })
}

export { internalServerError }
