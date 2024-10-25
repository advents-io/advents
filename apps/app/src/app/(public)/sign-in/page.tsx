import { Metadata } from 'next'
import { Suspense } from 'react'

import { PublicHeader } from './public-header'
import { SignInForm } from './sign-in-form'

export const metadata: Metadata = {
  title: 'Entrar | Advents',
}

export default async function SignIn() {
  return (
    <>
      <PublicHeader />
      <div className='flex flex-1 items-center justify-center bg-white px-4'>
        {/* useSearchParams() from `SignInForm` should be wrapped in a Suspense. */}
        <Suspense>
          <SignInForm />
        </Suspense>
      </div>
    </>
  )
}
