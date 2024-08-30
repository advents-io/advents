import { Metadata } from 'next'

import { SignInForm } from '@/components/sign-in-form'

export const metadata: Metadata = {
  title: 'Entrar | Advents',
}

export default async function SignIn() {
  return <SignInForm />
}
