import { NextResponse } from 'next/server'

function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 })
}

export { noContent }
