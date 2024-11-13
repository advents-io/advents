'use client'

import {
  createAppAction,
  CreateAppInput,
  createAppInputSchema,
  editAppAction,
  EditAppInput,
  editAppInputSchema,
  formatErrors,
  useAction,
} from '@advents/mutations'
import { LINK_DEFAULT_DOMAIN } from '@advents/queries/server'
import { zodResolver } from '@hookform/resolvers/zod'
import { App } from '@prisma/client'
import { SaveIcon } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ErrorAlert } from '@/components/error-alert'
import { LoadingPageContent } from '@/components/loading-page-content'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Button } from '@/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/card'
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
import { Separator } from '@/ui/separator'

import { DeleteAppButton } from './delete-app-button'

type Props = {
  app?: Pick<
    App,
    | 'id'
    | 'name'
    | 'slug'
    | 'defaultDomain'
    | 'androidUrl'
    | 'iosUrl'
    | 'defaultFallbackUrl'
    | 'qrcodeLogoUrl'
  >
  availableDomains: string[]
}

export const CreateEditAppForm = ({ app, availableDomains }: Props) => {
  const isCreate = !app

  const onSuccess = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    toast.success(isCreate ? 'App criado com sucesso.' : 'App alterado com sucesso.')
  }

  const onError = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const {
    execute: editApp,
    isExecuting: isEditing,
    result: editAppResult,
  } = useAction(editAppAction, {
    onSuccess,
    onError,
  })

  const {
    execute: createApp,
    isExecuting: isCreating,
    result: createAppResult,
  } = useAction(createAppAction, {
    onSuccess,
    onError,
  })

  const error = formatErrors(editAppResult) || formatErrors(createAppResult)

  const onSubmit = async (data: CreateAppInput | EditAppInput) => {
    if (isCreate) {
      createApp(data as CreateAppInput)
    } else {
      editApp(data as EditAppInput)
    }
  }

  const form = useForm<CreateAppInput | EditAppInput>({
    resolver: zodResolver(isCreate ? createAppInputSchema : editAppInputSchema),
    defaultValues: !isCreate
      ? app
      : {
          defaultDomain: LINK_DEFAULT_DOMAIN,
        },
  })

  const busy = isCreating || isEditing || form.formState.isSubmitting

  if (form.formState.isLoading) {
    return <LoadingPageContent className='my-10' />
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-10'>
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
            name='defaultDomain'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domínio padrão</FormLabel>

                <Select onValueChange={field.onChange} defaultValue={field.value} {...field}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {availableDomains.map((domain, index) => (
                      <SelectItem key={index} value={domain}>
                        {domain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormDescription>
                  Domínio que será pré preenchido ao criar um link. Para cada link será possível
                  alterar o domínio.
                  <br />
                  Exemplo do link com domínio:{' '}
                  <span className='font-mono font-semibold tracking-tighter text-primary'>
                    https://{field.value}/7yB46jk
                  </span>
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
                <FormDescription>
                  Url padrão que será utilizada ao criar um link.
                  <br />
                  Pode ser alterada em cada link criado.
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
                    placeholder='https://apps.apple.com/app/exemplo/id1234567890'
                  />
                </FormControl>
                <FormDescription>
                  Url padrão que será utilizada ao criar um link.
                  <br />
                  Pode ser alterada em cada link criado.
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
                <FormLabel optional>Url alternativa padrão</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='url'
                    placeholder='https://www.meusite.com'
                    value={field.value || undefined}
                  />
                </FormControl>
                <FormDescription>
                  Url alternativa padrão que será utilizada ao criar um link.
                  <br />É a url que o usuário será direcionado caso o dispositivo que abrir o link
                  não seja nem Android e nem iOS, como por exemplo, um computador Windows, Linux ou
                  macOS.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='qrcodeLogoUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel optional>Url do logo do QR Code</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='url'
                    placeholder='https://www.meusite.com/logo.png'
                    value={field.value || undefined}
                  />
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
              <SaveIcon />
              Salvar
            </LoadingSpinner>
          </Button>
        </form>
      </Form>

      {!isCreate && (
        <>
          <Separator />

          <Card className='border-destructive'>
            <CardHeader>
              <CardTitle className='text-lg'>Excluir app</CardTitle>
            </CardHeader>

            <CardContent>
              <CardDescription>
                Exclua permanentemente seu app, todos os links associados e estatísticas. Esta ação
                não pode ser desfeita.
              </CardDescription>
            </CardContent>

            <CardFooter>
              <DeleteAppButton appId={app.id} appSlug={app.slug} appName={app.name} />
            </CardFooter>
          </Card>
        </>
      )}
    </>
  )
}
