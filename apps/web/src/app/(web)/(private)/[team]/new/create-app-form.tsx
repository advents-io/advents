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
import { FaAppStoreIos as IosIcon } from 'react-icons/fa'
import { IoLogoAndroid as AndroidIcon } from 'react-icons/io'
import { toast } from 'sonner'

import { ErrorAlert } from '@/components/error-alert'
import { LoadingSpinner } from '@/components/loading-spinner'
import { SettingsField } from '@/components/settings-field'
import { Button } from '@/ui/button'
import { Form, FormField } from '@/ui/form'
import { Input, SlugInput } from '@/ui/input'

export const CreateAppForm = () => {
  const { team: teamSlug } = useParams<{ team: string }>()
  const posthog = usePostHog()

  const {
    execute: createApp,
    isExecuting,
    result,
  } = useAction(createAppAction, {
    onSuccess: ({ input }) => {
      posthog.capture('create_app', {
        team: teamSlug,
        name: input.name,
        slug: input.slug,
      })

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })

      toast.success('App criado.')
    },

    onError: () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
  })

  const handleCreateApp = (input: CreateAppInput) => {
    createApp({ ...input, teamSlug })
  }

  const error = formatErrors(result)

  const form = useForm<CreateAppInput>({
    resolver: zodResolver(createAppInputSchema),
    defaultValues: {
      name: '',
      slug: '',
      androidUrl: '',
      iosUrl: '',
      fallbackUrl: '',
    },
  })

  const busy = isExecuting || form.formState.isSubmitting

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateApp)} className='space-y-10'>
        <ErrorAlert error={error} />

        <FormField
          control={form.control}
          name='name'
          render={({ field, fieldState }) => (
            <SettingsField title='Nome' fieldState={fieldState}>
              Usado para identificar o app na plataforma.
              <Input {...field} placeholder='Nome do app' />
              Máximo de 64 caracteres.
            </SettingsField>
          )}
        />

        <FormField
          control={form.control}
          name='slug'
          render={({ field, fieldState }) => (
            <SettingsField title='Identificador único' fieldState={fieldState}>
              Valor único usado para identificar o app na plataforma.
              <SlugInput
                prefix={`app.advents.io/${teamSlug}/`}
                {...field}
                placeholder='nome-do-app'
              />
              Deve conter apenas letras minúsculas, números, hífen ou underline. Máximo de 48
              caracteres.
            </SettingsField>
          )}
        />

        <FormField
          control={form.control}
          name='androidUrl'
          render={({ field, fieldState }) => (
            <SettingsField
              title={
                <span className='inline-flex items-center gap-2'>
                  <AndroidIcon className='size-6' />
                  Url do app Android
                </span>
              }
              fieldState={fieldState}
            >
              Url padrão que será utilizada ao criar um link.
              <Input
                {...field}
                type='url'
                placeholder='https://play.google.com/store/apps/details?id=com.examplo.app'
              />
            </SettingsField>
          )}
        />

        <FormField
          control={form.control}
          name='iosUrl'
          render={({ field, fieldState }) => (
            <SettingsField
              title={
                <span className='inline-flex items-center gap-2'>
                  <IosIcon className='size-6' />
                  Url do app iOS
                </span>
              }
              fieldState={fieldState}
            >
              Url padrão que será utilizada ao criar um link.
              <Input
                {...field}
                type='url'
                placeholder='https://apps.apple.com/app/exemplo/id1234567890'
              />
            </SettingsField>
          )}
        />

        <FormField
          control={form.control}
          name='fallbackUrl'
          render={({ field, fieldState }) => (
            <SettingsField title='Url alternativa' fieldState={fieldState}>
              Url alternativa padrão que será utilizada ao criar um link.
              <Input {...field} type='url' placeholder='https://www.meusite.com' />É a url que o
              usuário será direcionado caso o dispositivo que abrir o link seja Desktop.
            </SettingsField>
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
