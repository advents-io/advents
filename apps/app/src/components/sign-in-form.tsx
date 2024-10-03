'use client'

import {
  formatErrors,
  signInAction,
  SignInInputProps,
  signInInputSchema,
  useAction,
} from '@advents/actions'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import AdventsLogo from '@/assets/advents/logo.svg'
import { ContactDropdown } from '@/components/contact-dropdown'
import { ErrorAlert } from '@/components/error-alert'
import { LoadingContent } from '@/components/loading-content'
import { Button } from '@/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/card'
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(signIn)}>
        <Card className='w-full max-w-sm'>
          <CardHeader>
            <Image src={AdventsLogo} alt='Logo da Advents' className='mb-10 size-8' />

            {!emailSent && (
              <>
                <CardTitle>Entre na Advents</CardTitle>

                <CardDescription>
                  Entre com o e-mail cadastrado para receber um link de acesso.
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent>
            {emailSent ? (
              <div className='space-y-4'>
                <p>
                  Um link de acesso foi enviado para o e-mail <b>{input.email}</b>.
                </p>

                <p>Verifique sua caixa de entrada e abra o link enviado.</p>
              </div>
            ) : (
              <>
                <ErrorAlert error={error} />

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
              </>
            )}
          </CardContent>

          {!emailSent && (
            <CardFooter>
              <div className='flex flex-1 flex-col gap-3'>
                <Button type='submit' disabled={isExecuting}>
                  <LoadingContent loading={isExecuting}>Entrar</LoadingContent>
                </Button>

                <span className='text-sm'>
                  Não possui uma conta?{' '}
                  <ContactDropdown showDocs={false}>
                    <Button variant='link' size='sm' className='p-0'>
                      Entre em contato.
                    </Button>
                  </ContactDropdown>
                </span>
              </div>
            </CardFooter>
          )}
        </Card>
      </form>
    </Form>
  )
}
