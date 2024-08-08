import { NextResponse } from 'next/server'

function ok<T>(body: T): NextResponse<T> {
  return NextResponse.json<T>(body, { status: 200 })
}

export { ok }
