'use client'

import { DOCS_URLS, routes } from '@advents/common'
import {
  editAppAction,
  EditAppFormInput,
  editAppFormInputSchema,
  formatErrors,
  useAction,
} from '@advents/mutations'
import { zodResolver } from '@hookform/resolvers/zod'
import { App } from '@prisma/client'
import { Loader2Icon, SquareArrowOutUpRightIcon } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { FaAppStoreIos as IosIcon } from 'react-icons/fa'
import { IoLogoAndroid as AndroidIcon } from 'react-icons/io'
import { toast } from 'sonner'

import { ErrorAlert } from '@/components/error-alert'
import { LoadingContent } from '@/components/loading-content'
import { SettingsField } from '@/components/settings-field'
import { Button } from '@/ui/button'
import { Form, FormField } from '@/ui/form'
import { Input, SlugInput } from '@/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

import { DeleteAppButton } from './delete-app-button'
import Loading from './loading'

interface Props {
  app: Pick<
    App,
    | 'id'
    | 'name'
    | 'slug'
    | 'defaultDomain'
    | 'androidUrl'
    | 'iosUrl'
    | 'disableIosPreviewPage'
    | 'fallbackUrl'
  >
  availableDomains: string[]
}

export const EditAppForm = ({ app, availableDomains }: Props) => {
  const router = useRouter()
  const { team: teamSlug } = useParams<{ team: string }>()

  const {
    executeAsync: editApp,
    isExecuting,
    result,
  } = useAction(editAppAction, {
    onError: () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
  })

  const error = formatErrors(result)

  const form = useForm<EditAppFormInput>({
    resolver: zodResolver(editAppFormInputSchema),
    defaultValues: app,
  })

  const busy = isExecuting || form.formState.isSubmitting

  if (form.formState.isLoading) {
    return <Loading />
  }

  return (
    <Form {...form}>
      <form className='space-y-10'>
        <ErrorAlert error={error} />

        <FormField
          control={form.control}
          name='name'
          render={({ field, fieldState }) => (
            <SettingsField
              fieldState={fieldState}
              busy={busy}
              title='Nome'
              footerLabel='Máximo de 64 caracteres.'
              footerButtonOnClick={form.handleSubmit(() =>
                toast.promise(
                  async () => {
                    const result = await editApp({
                      ...(form.formState.defaultValues as EditAppFormInput),
                      name: field.value,
                      id: app.id,
                    })

                    if (result?.serverError) {
                      throw new Error()
                    }

                    form.resetField('name', {
                      defaultValue: field.value,
                    })
                  },
                  {
                    loading: 'Alterando o nome do app...',
                    success: 'Nome do app alterado.',
                    error: 'Erro ao alterar o nome do app.',
                  },
                ),
              )}
            >
              <p>Usado para identificar o app na plataforma.</p>

              <Input {...field} placeholder='Nome do app' />
            </SettingsField>
          )}
        />

        <FormField
          control={form.control}
          name='slug'
          render={({ field, fieldState }) => (
            <SettingsField
              fieldState={fieldState}
              busy={busy}
              title='Identificador único'
              footerLabel='Deve conter apenas letras minúsculas, números, hífen ou underline. Máximo de 48 caracteres.'
              footerButtonOnClick={form.handleSubmit(() =>
                toast.promise(
                  async () => {
                    const result = await editApp({
                      ...(form.formState.defaultValues as EditAppFormInput),
                      slug: field.value,
                      id: app.id,
                    })

                    if (result?.serverError) {
                      throw new Error()
                    }

                    form.resetField('slug', {
                      defaultValue: field.value,
                    })

                    router.replace(routes.SETTINGS.path(teamSlug, field.value), {
                      scroll: false,
                    })
                  },
                  {
                    loading: 'Alterando o identificador único...',
                    success: 'Identificador único alterado.',
                    error: 'Erro ao alterar o identificador único.',
                  },
                ),
              )}
            >
              <p>Valor único usado para identificar o app na plataforma.</p>

              <SlugInput
                {...field}
                placeholder='nome-do-app'
                prefix={`app.advents.io/${teamSlug}/`}
              />
            </SettingsField>
          )}
        />

        <FormField
          control={form.control}
          name='defaultDomain'
          render={({ field, fieldState }) => (
            <SettingsField
              fieldState={fieldState}
              busy={busy}
              title='Domínio padrão'
              footer={
                <span>
                  Alterações não afetam links já criados. Adicione um domínio customizado na{' '}
                  <Link
                    href={routes.SETTINGS_DOMAINS.path(teamSlug, app.slug)}
                    className='inline-flex items-center whitespace-pre text-blue-600 hover:underline'
                    target='_blank'
                  >
                    página de domínios. <SquareArrowOutUpRightIcon className='size-4' />
                  </Link>
                </span>
              }
            >
              <p>
                Domínio que será pré preenchido ao criar um link. Para cada link será possível
                alterar o domínio.
              </p>

              <Select
                onValueChange={value => {
                  field.onChange(value)

                  form.handleSubmit(() =>
                    toast.promise(
                      async () => {
                        const result = await editApp({
                          ...(form.formState.defaultValues as EditAppFormInput),
                          defaultDomain: value,
                          id: app.id,
                        })

                        if (result?.serverError) {
                          throw new Error()
                        }

                        form.resetField('defaultDomain', {
                          defaultValue: value,
                        })
                      },
                      {
                        loading: 'Alterando o domínio padrão...',
                        success: 'Domínio padrão alterado.',
                        error: 'Erro ao alterar o domínio padrão.',
                      },
                    ),
                  )()
                }}
                defaultValue={field.value}
                disabled={busy}
                {...field}
              >
                <SelectTrigger className='relative'>
                  <SelectValue />

                  {busy && (
                    <div className='absolute right-3 z-10 bg-white'>
                      <Loader2Icon className='size-4 animate-spin' />
                    </div>
                  )}
                </SelectTrigger>

                <SelectContent>
                  {availableDomains.map((domain, index) => (
                    <SelectItem key={index} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <p className='text-muted-foreground'>
                Exemplo do link com domínio:{' '}
                <span className='font-mono font-semibold tracking-tighter text-primary'>
                  https://{field.value}/7yB46jk
                </span>
              </p>
            </SettingsField>
          )}
        />

        <FormField
          control={form.control}
          name='androidUrl'
          render={({ field, fieldState }) => (
            <SettingsField
              fieldState={fieldState}
              busy={busy}
              title={
                <span className='inline-flex items-center gap-2'>
                  <AndroidIcon className='size-6' />
                  Url do app Android
                </span>
              }
              footerLabel='Alterações não afetam links criados com a url personalizada.'
              footerButtonOnClick={form.handleSubmit(() =>
                toast.promise(
                  async () => {
                    const result = await editApp({
                      ...(form.formState.defaultValues as EditAppFormInput),
                      androidUrl: field.value,
                      id: app.id,
                    })

                    if (result?.serverError) {
                      throw new Error()
                    }

                    form.resetField('androidUrl', {
                      defaultValue: field.value,
                    })
                  },
                  {
                    loading: 'Alterando a url do Android...',
                    success: 'Url do Android alterada.',
                    error: 'Erro ao alterar a url do Android.',
                  },
                ),
              )}
            >
              <p>Url padrão que será utilizada ao criar um link.</p>

              <Input
                {...field}
                type='url'
                placeholder='https://play.google.com/store/apps/details?id=com.examplo.app'
              />

              <p className='text-muted-foreground'>
                Pode ser alterada individualmente em cada link.
              </p>
            </SettingsField>
          )}
        />

        <FormField
          control={form.control}
          name='iosUrl'
          render={({ field, fieldState }) => (
            <SettingsField
              fieldState={fieldState}
              busy={busy}
              title={
                <span className='inline-flex items-center gap-2'>
                  <IosIcon className='size-6' />
                  Url do app iOS
                </span>
              }
              footerLabel='Alterações não afetam links criados com a url personalizada.'
              footerButtonOnClick={form.handleSubmit(() =>
                toast.promise(
                  async () => {
                    const result = await editApp({
                      ...(form.formState.defaultValues as EditAppFormInput),
                      iosUrl: field.value,
                      id: app.id,
                    })

                    if (result?.serverError) {
                      throw new Error()
                    }

                    form.resetField('iosUrl', {
                      defaultValue: field.value,
                    })
                  },
                  {
                    loading: 'Alterando a url do iOS...',
                    success: 'Url do iOS alterada.',
                    error: 'Erro ao alterar a url do iOS.',
                  },
                ),
              )}
            >
              <p>Url padrão que será utilizada ao criar um link.</p>

              <Input
                {...field}
                type='url'
                placeholder='https://apps.apple.com/app/exemplo/id1234567890'
              />

              <p className='text-muted-foreground'>
                Pode ser alterada individualmente em cada link.
              </p>
            </SettingsField>
          )}
        />

        <FormField
          control={form.control}
          name='disableIosPreviewPage'
          render={({ field, fieldState }) => (
            <SettingsField
              fieldState={fieldState}
              busy={busy}
              title='Página de pré-visualização iOS'
              footer={
                <span>
                  Alterações não afetam links criados com opção personalizada. Saiba mais sobre a{' '}
                  <Link
                    href={DOCS_URLS.IOS_PREVIEW_PAGE}
                    className='inline-flex items-center whitespace-pre text-blue-600 hover:underline'
                    target='_blank'
                  >
                    página de pré-visualização. <SquareArrowOutUpRightIcon className='size-4' />
                  </Link>
                </span>
              }
            >
              <p>
                Ao desativar a página de pré-visualização em dispositivos iOS, os usuários serão
                direcionados diretamente para a App Store, caso não possua o app instalado.
              </p>

              <div className='flex items-center gap-2'>
                <Select
                  onValueChange={value => {
                    const disabled = value === 'true'
                    field.onChange(disabled)

                    form.handleSubmit(() =>
                      toast.promise(
                        async () => {
                          const result = await editApp({
                            ...(form.formState.defaultValues as EditAppFormInput),
                            disableIosPreviewPage: disabled,
                            id: app.id,
                          })

                          if (result?.serverError) {
                            throw new Error()
                          }

                          form.resetField('disableIosPreviewPage', {
                            defaultValue: disabled,
                          })
                        },
                        {
                          loading: 'Alterando configuração da página de pré-visualização...',
                          success: 'Configuração da página de pré-visualização alterada.',
                          error: 'Erro ao alterar a configuração da página de pré-visualização.',
                        },
                      ),
                    )()
                  }}
                  value={field.value.toString()}
                  disabled={busy}
                >
                  <SelectTrigger className='w-[200px]'>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value='false'>Ativada</SelectItem>

                    <SelectItem value='true'>Desativada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className='text-muted-foreground'>
                Pode ser alterada individualmente em cada link.
              </p>
            </SettingsField>
          )}
        />

        <FormField
          control={form.control}
          name='fallbackUrl'
          render={({ field, fieldState }) => (
            <SettingsField
              fieldState={fieldState}
              busy={busy}
              title='Url alternativa padrão'
              footerLabel='Alterações não afetam links criados com a url personalizada.'
              footerButtonOnClick={form.handleSubmit(() =>
                toast.promise(
                  async () => {
                    const result = await editApp({
                      ...(form.formState.defaultValues as EditAppFormInput),
                      fallbackUrl: field.value,
                      id: app.id,
                    })

                    if (result?.serverError) {
                      throw new Error()
                    }

                    form.resetField('fallbackUrl', {
                      defaultValue: field.value,
                    })
                  },
                  {
                    loading: 'Alterando a url alternativa...',
                    success: 'Url alternativa alterada.',
                    error: 'Erro ao alterar a url alternativa.',
                  },
                ),
              )}
            >
              <span>
                Url alternativa padrão que será utilizada ao criar um link.
                <br />
                <br />É a url que o usuário será direcionado caso o dispositivo que abrir o link
                seja Desktop.
              </span>

              <Input
                {...field}
                type='url'
                placeholder='https://www.meusite.com'
                value={field.value || ''}
              />

              <p className='text-muted-foreground'>
                Pode ser alterada individualmente em cada link.
              </p>
            </SettingsField>
          )}
        />

        <SettingsField
          fieldState={undefined}
          busy={busy}
          title='Excluir app'
          isDestructive
          footer={
            <div className='ml-auto'>
              <DeleteAppButton appId={app.id} appSlug={app.slug} appName={app.name}>
                <Button variant='destructive' size='sm' disabled={busy}>
                  <LoadingContent loading={busy}>Excluir app</LoadingContent>
                </Button>
              </DeleteAppButton>
            </div>
          }
        >
          Exclua permanentemente seu app, todos os links associados e estatísticas. Esta ação não
          pode ser desfeita.
        </SettingsField>
      </form>
    </Form>
  )
}
