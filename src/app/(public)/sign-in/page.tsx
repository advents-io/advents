import { Metadata } from 'next'

import { PublicHeader } from '@/components/public-header'
import { SignInForm } from '@/components/sign-in-form'

export const metadata: Metadata = {
  title: 'Entrar | Advents',
}

export default async function SignIn() {
  return (
    <>
      <PublicHeader />
      <div className='flex flex-1 items-center justify-center'>
        <SignInForm />
      </div>
    </>
  )
}
