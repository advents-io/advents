import { NextResponse } from 'next/server'

function created(): NextResponse<null>
function created<T>(body: T): NextResponse<T>

function created<T>(body?: T): NextResponse<T | null> {
  if (!body) {
    return NextResponse.json(null, { status: 201 })
  }

  return NextResponse.json<T>(body, { status: 201 })
}

export { created }
