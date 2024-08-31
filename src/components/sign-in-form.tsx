'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import AdventsLogo from 'public/advents-logo.svg'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { signInAction } from '@/actions/auth/sign-in-action'
import { formatErrors } from '@/actions/safe-action'
import { SignInInputProps, signInInputSchema } from '@/actions/schemas/input/auth/sign-in-input'
import { LoadingContent } from '@/components/loading-content'
import { Alert, AlertDescription, AlertTitle } from '@/ui/alert'
import { Button } from '@/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Input } from '@/ui/input'

export const SignInForm = () => {
  const [emailSent, setEmailSent] = useState(false)

  const searchParams = useSearchParams()
  const errorDescription = searchParams.get('error_description')

  const {
    execute: signIn,
    isExecuting,
    result,
    input,
  } = useAction(signInAction, {
    onSuccess: () => setEmailSent(true),
  })

  const error = formatErrors(result) || errorDescription

  const form = useForm<SignInInputProps>({
    resolver: zodResolver(signInInputSchema),
  })

  if (emailSent) {
    return (
      <div className='max-w-xs space-y-4'>
        <p>
          Um link de acesso foi enviado para o e-mail <b>{input.email}</b>.
        </p>

        <p>Verifique sua caixa de entrada e abra o link enviado.</p>

        <Button className='mt-2' variant='outline' onClick={() => setEmailSent(false)}>
          <ArrowLeft className='mr-2 size-4' />
          Voltar
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(signIn)} className='mx-10 w-full max-w-sm'>
        <Image src={AdventsLogo} alt='Logo da Advents' className='size-8' />

        <h1 className='mt-10 text-xl font-medium'>Entre na Advents</h1>

        {error && (
          <Alert variant='destructive' className='my-4'>
            <AlertCircle className='size-4' />
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
                  <Input placeholder='jeff@amazon.com' type='email' {...field} />
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
