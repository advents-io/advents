import { NextResponse } from 'next/server'

import { ErrorResponse } from '@/api/error-handler'

function notFound(body: ErrorResponse): NextResponse<ErrorResponse> {
  return NextResponse.json<ErrorResponse>(body, { status: 404 })
}

export { notFound }
