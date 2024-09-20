import { Metadata } from 'next'
import { Suspense } from 'react'

import { PublicHeader } from '@/components/public-header'
import { SignInForm } from '@/components/sign-in-form'

export const metadata: Metadata = {
  title: 'Entrar | Advents',
}

export default async function SignIn() {
  return (
    <>
      <PublicHeader />
      <div className='mx-4 flex flex-1 items-center justify-center'>
        <Suspense>
          <SignInForm />
        </Suspense>
      </div>
    </>
  )
}
