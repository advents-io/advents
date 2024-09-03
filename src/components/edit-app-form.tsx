'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { editAppAction } from '@/actions/app/edit-app-action'
import { getAppAction } from '@/actions/app/get-app-action'
import { formatErrors } from '@/actions/safe-action'
import {
  EditAppInputFormProps,
  editAppInputSchema,
} from '@/actions/schemas/input/app/edit-app-input'
import { GetAppOutputProps } from '@/actions/schemas/output/app/get-app-output'
import { ErrorAlert } from '@/components/error-alert'
import { LoadingPageContent } from '@/components/loading-page-content'
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
import { Input } from '@/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { LINK_DOMAINS } from '@/utils/constants'

export const EditAppForm = () => {
  const { app, team } = useParams<{ app: string; team: string }>()

  const form = useForm<EditAppInputFormProps>({
    resolver: zodResolver(editAppInputSchema),
    defaultValues: async () =>
      (await getAppAction({ appSlug: app, teamSlug: team }))?.data as GetAppOutputProps,
  })

  const {
    execute: editApp,
    isExecuting,
    result,
  } = useAction(editAppAction, {
    onSuccess: () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
      toast.success('App alterado com sucesso.')
    },
    onError: () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
  })

  const busy = isExecuting || form.formState.isSubmitting

  const error = formatErrors(result)

  if (form.formState.isLoading) {
    return <LoadingPageContent className='mt-10' />
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(editApp)} className='space-y-10'>
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
                <Input {...field} placeholder='nome-do-app' />
              </FormControl>
              <FormDescription>
                Valor único usado para identificar o app na plataforma. Deve conter apenas letras
                minúsculas, números, hífen ou underline.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='defaultDomain'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domínio padrão</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={LINK_DOMAINS[0]} {...field}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {LINK_DOMAINS.map(domain => (
                    <SelectItem key={domain} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Domínio que será pré preenchido ao criar um link. Para cada link será possível
                alterar o domínio.
                <br />
                Exemplo do link com domínio: https://{field.value}/7yB46jk
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
                  placeholder='https://play.google.com/store/apps/details?id=com.example'
                />
              </FormControl>
              <FormDescription>
                Url padrão que será utilizada ao criar um link. Pode ser alterada em cada link
                criado.
              </FormDescription>
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
                  placeholder='https://apps.apple.com/br/app/example/id1234567890'
                />
              </FormControl>
              <FormDescription>
                Url padrão que será utilizada ao criar um link. Pode ser alterada em cada link
                criado.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='defaultFallbackUrl'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Url alternativa padrão</FormLabel>
              <FormControl>
                <Input {...field} type='url' placeholder='https://www.meusite.com' />
              </FormControl>
              <FormDescription>
                Url alternativa padrão que será utilizada ao criar um link.
                <br />É a url que o usuário será direcionado caso o dispositivo que abrir o link não
                seja nem Android e nem iOS, por exemplo, um computador Windows, Linux ou macOS.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='qrCodeLogoUrl'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Url do logo do QR Code</FormLabel>
              <FormControl>
                <Input {...field} type='url' placeholder='https://www.meusite.com/logo.png' />
              </FormControl>
              <FormDescription>
                Url da image que será utilizada para inserir no centro do QR Code de um link.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full md:w-auto' disabled={busy}>
          <LoadingSpinner loading={busy}>
            <Save className='size-4' />
            Salvar
          </LoadingSpinner>
        </Button>
      </form>
    </Form>
  )
}
