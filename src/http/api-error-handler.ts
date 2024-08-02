import { NextResponse } from 'next/server'

export async function safeEndpoint<T>(handler: () => Promise<NextResponse<T>>) {
  try {
    return await handler()
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
