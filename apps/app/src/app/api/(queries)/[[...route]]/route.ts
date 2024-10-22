/* eslint-disable @typescript-eslint/no-explicit-any */
import { api, handle } from '@advents/queries'

// BUG: This is a workaround to make hono work with Next.js 15

export const GET = (req: Request, context: any) => handle(api)(req, context)
export const POST = (req: Request, context: any) => handle(api)(req, context)
export const PUT = (req: Request, context: any) => handle(api)(req, context)
export const PATCH = (req: Request, context: any) => handle(api)(req, context)
export const DELETE = (req: Request, context: any) => handle(api)(req, context)
