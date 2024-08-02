import { NextResponse } from 'next/server'

export function Created<T>(body?: T) {
  return NextResponse.json<T | null>(body || null, { status: 201 })
}
