'use client'

import { SIGN_UP_URL } from '@advents/common'
import { supabaseClient } from '@advents/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { ErrorAlert } from '@/components/error-alert'
import { LoadingContent } from '@/components/loading-content'
import { Button } from '@/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Input } from '@/ui/input'
import { Separator } from '@/ui/separator'

const signInInputSchema = z.object({
  email: z.string({ message: 'E-mail inválido.' }).email('E-mail inválido.'),
})

type SignInInputProps = z.infer<typeof signInInputSchema>

export const SignInForm = () => {
  const searchParams = useSearchParams()

  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState<string | null>(searchParams.get('error_description'))
  const [isExecuting, setIsExecuting] = useState(false)

  const signIn = async ({ email }: SignInInputProps) => {
    try {
      setIsExecuting(true)
      setError(null)

      const supabase = supabaseClient()

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/api/auth/confirm`,
        },
      })

      if (error) {
        setError(error.code === 'otp_disabled' ? 'E-mail não cadastrado.' : error.message)
        return
      }

      setEmailSent(true)
    } finally {
      setIsExecuting(false)
    }
  }

  const form = useForm<SignInInputProps>({
    resolver: zodResolver(signInInputSchema),
    defaultValues: {
      email: '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(signIn)} className='mx-auto min-h-72 w-full max-w-xs'>
        <p className='mb-6 text-2xl font-bold'>Entre na Advents</p>

        <AnimatePresence mode='wait'>
          {emailSent ? (
            <motion.div
              key='emailSent'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className='space-y-6'>
                <p>
                  Um link de acesso foi enviado para o e-mail <b>{form.getValues('email')}</b>.
                </p>

                <p>Verifique sua caixa de entrada e abra o link enviado.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key='signInForm'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className='space-y-6'>
                <ErrorAlert error={error} />

                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Informe seu e-mail</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='jeff@amazon.com'
                          className='w-full'
                          type='email'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type='submit' size='lg' className='w-full' disabled={isExecuting}>
                  <LoadingContent loading={isExecuting}>Entrar</LoadingContent>
                </Button>

                <Separator />

                <p className='text-sm text-muted-foreground'>
                  Não possui uma conta?{' '}
                  <Link
                    href={SIGN_UP_URL}
                    className='font-semibold text-primary underline'
                    target='_blank'
                  >
                    Cadastre-se.
                  </Link>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </Form>
  )
}
