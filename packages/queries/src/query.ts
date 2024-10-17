import { cookies } from 'next/headers'

export const query = (input: string | RequestInfo | URL, init?: RequestInit) =>
  fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      Cookie: cookies().toString(),
    },
  })
