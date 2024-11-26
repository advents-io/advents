'use client'

import {
  createAppAction,
  CreateAppInput,
  createAppInputSchema,
  formatErrors,
  useAction,
} from '@advents/mutations'
import { zodResolver } from '@hookform/resolvers/zod'
import { SaveIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { usePostHog } from 'posthog-js/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ErrorAlert } from '@/components/error-alert'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Button } from '@/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/form'
import { Input, SlugInput } from '@/ui/input'

export const CreateAppForm = () => {
  const { team } = useParams<{ team: string }>()
  const posthog = usePostHog()

  const {
    execute: createApp,
    isExecuting,
    result,
  } = useAction(createAppAction, {
    onSuccess: ({ input }) => {
      posthog.capture('create_app', {
        team,
        name: input.name,
        slug: input.slug,
      })

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })

      toast.success('App criado com sucesso.')
    },

    onError: () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
  })

  const error = formatErrors(result)

  const form = useForm<CreateAppInput>({
    resolver: zodResolver(createAppInputSchema),
    defaultValues: {
      name: '',
      slug: '',
      androidUrl: '',
      iosUrl: '',
      defaultFallbackUrl: '',
    },
  })

  const busy = isExecuting || form.formState.isSubmitting

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(createApp)} className='space-y-10'>
        <ErrorAlert error={error} />

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>

              <FormControl>
                <Input {...field} placeholder='Nome do app' />
              </FormControl>

              <FormDescription>Usado para identificar o app na plataforma.</FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='slug'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identificador único</FormLabel>

              <FormControl>
                <SlugInput
                  prefix={`app.advents.io/${team}/`}
                  {...field}
                  placeholder='nome-do-app'
                />
              </FormControl>

              <FormDescription>
                Valor único usado para identificar o app na plataforma.
                <br />
                Deve conter apenas letras minúsculas, números, hífen ou underline.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='androidUrl'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Url do app Android</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type='url'
                  placeholder='https://play.google.com/store/apps/details?id=com.examplo.app'
                />
              </FormControl>
              <FormDescription>Url padrão que será utilizada ao criar um link.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='iosUrl'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Url do app iOS</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type='url'
                  placeholder='https://apps.apple.com/app/exemplo/id1234567890'
                />
              </FormControl>
              <FormDescription>Url padrão que será utilizada ao criar um link.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='defaultFallbackUrl'
          render={({ field }) => (
            <FormItem>
              <FormLabel optional>Url alternativa padrão</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type='url'
                  placeholder='https://www.meusite.com'
                  value={field.value || ''}
                />
              </FormControl>
              <div className='space-y-2 text-sm text-muted-foreground'>
                <p>Url alternativa padrão que será utilizada ao criar um link.</p>
                <p>
                  É a url que o usuário será direcionado caso o dispositivo que abrir o link não
                  seja nem Android e nem iOS.
                </p>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full md:w-auto' disabled={busy}>
          <LoadingSpinner loading={busy}>
            <SaveIcon />
            Salvar
          </LoadingSpinner>
        </Button>
      </form>
    </Form>
  )
}
