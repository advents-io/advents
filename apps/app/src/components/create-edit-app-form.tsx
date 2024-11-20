'use client'

import { DOCS_URLS } from '@advents/common'
import {
  createAppAction,
  CreateAppInput,
  createAppInputSchema,
  editAppAction,
  EditAppFormInput,
  editAppFormInputSchema,
  formatErrors,
  useAction,
} from '@advents/mutations'
import { zodResolver } from '@hookform/resolvers/zod'
import { App } from '@prisma/client'
import { SaveIcon, SquareArrowOutUpRightIcon } from 'lucide-react'
import Link from 'next/link'
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
import { Switch } from '@/ui/switch'

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
    | 'defaultDisableIosPreviewPage'
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

  const onSubmit = async (data: CreateAppInput | EditAppFormInput) => {
    if (isCreate) {
      createApp(data as CreateAppInput)
    } else {
      editApp({
        ...(data as EditAppFormInput),
        id: app.id,
      })
    }
  }

  const form = useForm<CreateAppInput | EditAppFormInput>({
    resolver: zodResolver(isCreate ? createAppInputSchema : editAppFormInputSchema),
    defaultValues: !isCreate
      ? app
      : {
          name: '',
          slug: '',
          androidUrl: '',
          iosUrl: '',
          defaultDisableIosPreviewPage: false,
          defaultFallbackUrl: '',
          qrcodeLogoUrl: '',
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

          {!isCreate && (
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
                    <br />
                    Alterações não afetam links já criados.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />
          )}

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
                  <br />
                  Alterações não afetam links já criados.
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
                  <br />
                  Alterações não afetam links já criados.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='defaultDisableIosPreviewPage'
            render={({ field }) => (
              <FormItem>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between gap-2'>
                    <div>
                      <FormLabel
                        tooltip={
                          <span>
                            Desativa a página de pré-visualização em dispositivos iOS, direcionando
                            os usuários diretamente para a App Store.
                            <br />
                            <br />
                            A página de pré-visualização melhora a precisão da atribuição em
                            dispositivos iOS. Ao abrir um link, o usuário é direcionado para a
                            página contendo um botão de ação que copia o identificador do link no
                            clipboard do dispositivo. Ao abrir o app pela primeira vez, o
                            identificador é lido, fazendo com que a atribuição seja garantida.
                            <br />
                            <br />
                            Saiba mais no{' '}
                            <Link
                              href={DOCS_URLS.IOS_PREVIEW_PAGE}
                              className='inline-flex items-center whitespace-pre text-blue-600 hover:underline'
                              target='_blank'
                            >
                              artigo sobre a página de pré-visualização.{' '}
                              <SquareArrowOutUpRightIcon className='size-4' />
                            </Link>
                          </span>
                        }
                      >
                        Desabilitar página de pré-visualização no iOS
                      </FormLabel>
                      <FormDescription>Alterações não afetam links já criados.</FormDescription>
                    </div>

                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </CardHeader>
                </Card>
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
                <FormDescription>
                  Url alternativa padrão que será utilizada ao criar um link.
                  <br />
                  É a url que o usuário será direcionado caso o dispositivo que abrir o link não
                  seja nem Android e nem iOS, como por exemplo, um computador Windows, Linux ou
                  macOS.
                  <br />
                  Pode ser alterada em cada link criado.
                  <br />
                  Alterações não afetam links já criados.
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
                    value={field.value || ''}
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
