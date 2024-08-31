import { Metadata } from 'next'

import { resetPasswordAction } from '@/actions/auth/reset-password-action'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'

export const metadata: Metadata = {
  title: 'Resetar senha | Advents',
}

export default async function ResetPassword() {
  return (
    <form className='max-w-md gap-2'>
      <h1 className='text-2xl font-medium'>Reset password</h1>
      <p className='text-sm text-foreground/60'>Please enter your new password below.</p>
      <Label htmlFor='password'>New password</Label>
      <Input type='password' name='password' placeholder='New password' required />
      <Label htmlFor='confirmPassword'>Confirm password</Label>
      <Input type='password' name='confirmPassword' placeholder='Confirm password' required />
      <Button formAction={resetPasswordAction}>Reset password</Button>
    </form>
  )
}
