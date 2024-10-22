import { Metadata } from 'next'

import { PublicHeader } from './public-header'
import { SignInForm } from './sign-in-form'

export const metadata: Metadata = {
  title: 'Entrar | Advents',
}

export default async function SignIn() {
  return (
    <>
      <PublicHeader />
      <div className='mx-4 flex flex-1 items-center justify-center'>
        <SignInForm />
      </div>
    </>
  )
}
