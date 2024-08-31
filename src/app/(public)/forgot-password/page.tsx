import { Metadata } from 'next'
import Link from 'next/link'

import { forgotPasswordAction } from '@/actions/auth/forgot-password-action'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { routes } from '@/utils/routes'

export const metadata: Metadata = {
  title: 'Esqueceu sua senha? | Advents',
}

export default async function ForgotPassword() {
  return (
    <form className='min-w-64'>
      <div>
        <h1 className='text-2xl font-medium'>Forgot Password</h1>
        <p className='text-sm text-secondary-foreground'>
          Already have an account?{' '}
          <Link className='text-primary underline' href={routes.SIGN_IN.path}>
            Sign in
          </Link>
        </p>
      </div>
      <div className='mt-8 flex flex-col gap-2 [&>input]:mb-3'>
        <Label htmlFor='email'>Email</Label>
        <Input name='email' placeholder='you@example.com' required />
        <Button formAction={forgotPasswordAction}>Reset Password</Button>
      </div>
    </form>
  )
}
