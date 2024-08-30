'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'

import { signInAction } from '@/actions/auth/sign-in-action'
import { formatErrors } from '@/actions/safe-action'
import { SignInInputProps, signInInputSchema } from '@/actions/schemas/input/auth/sign-in-input'
import { LoadingContent } from '@/components/loading-content'
import { Alert, AlertDescription, AlertTitle } from '@/ui/alert'
import { Button } from '@/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Input } from '@/ui/input'
import { routes } from '@/utils/routes'

export const SignInForm = () => {
  const { execute: signIn, isExecuting, result } = useAction(signInAction)

  const error = formatErrors(result)

  const form = useForm<SignInInputProps>({
    resolver: zodResolver(signInInputSchema),
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(signIn)} className='min-w-64'>
        <h1 className='text-2xl font-medium'>Entrar</h1>

        {error && (
          <Alert variant='destructive' className='mt-6'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Ops!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className='mt-6 flex flex-col gap-6'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='seu@email.com' type='email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center justify-between'>
                  <FormLabel>Senha</FormLabel>

                  <Link
                    className='text-xs text-foreground underline'
                    href={routes.FORGOT_PASSWORD.path}
                  >
                    Esqueceu a senha?
                  </Link>
                </div>

                <FormControl>
                  <Input placeholder='******' type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' disabled={isExecuting}>
            <LoadingContent loading={isExecuting}>Entrar</LoadingContent>
          </Button>
        </div>
      </form>
    </Form>
  )
}
