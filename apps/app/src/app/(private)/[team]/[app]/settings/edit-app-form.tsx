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
import { toast } from 'sonner'

import { ErrorAlert } from '@/components/error-alert'
import { LoadingContent } from '@/components/loading-content'
import { SettingsField } from '@/components/settings-field'
import { Button } from '@/ui/button'
import { Form, FormField } from '@/ui/form'
import { Input } from '@/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { Switch } from '@/ui/switch'

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
    | 'defaultDisableIosPreviewPage'
    | 'defaultFallbackUrl'
    | 'qrcodeLogoUrl'
  >
  availableDomains: string[]
}

export const EditAppForm = ({ app, availableDomains }: Props) => {
  const router = useRouter()
  const { team: teamSlug } = useParams<{ team: string }>()

  const {
    executeAsync: editApp,
    isExecuting: isEditing,
    result: editAppResult,
  } = useAction(editAppAction, {
    onError: () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
  })

  const error = formatErrors(editAppResult)

  const form = useForm<EditAppFormInput>({
    resolver: zodResolver(editAppFormInputSchema),
    defaultValues: app,
  })

  const busy = isEditing || form.formState.isSubmitting

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
              footerButtonOnClick={() =>
                form.handleSubmit(() =>
                  toast.promise(
                    async () => {
                      await editApp({
                        ...(form.formState.defaultValues as EditAppFormInput),
                        name: field.value,
                        id: app.id,
                      })

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
                )()
              }
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
              footerButtonOnClick={() =>
                form.handleSubmit(() =>
                  toast.promise(
                    async () => {
                      await editApp({
                        ...(form.formState.defaultValues as EditAppFormInput),
                        slug: field.value,
                        id: app.id,
                      })

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
                )()
              }
            >
              <p>Valor único usado para identificar o app na plataforma.</p>

              <Input {...field} placeholder='nome-do-app' />
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
                        await editApp({
                          ...(form.formState.defaultValues as EditAppFormInput),
                          defaultDomain: value,
                          id: app.id,
                        })

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
              title='Url do app Android'
              footerLabel='Alterações não afetam links já criados.'
              footerButtonOnClick={() =>
                form.handleSubmit(() =>
                  toast.promise(
                    async () => {
                      await editApp({
                        ...(form.formState.defaultValues as EditAppFormInput),
                        androidUrl: field.value,
                        id: app.id,
                      })

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
                )()
              }
            >
              <p>Url padrão que será utilizada ao criar um link.</p>

              <Input
                {...field}
                type='url'
                placeholder='https://play.google.com/store/apps/details?id=com.examplo.app'
              />

              <p className='text-muted-foreground'>Pode ser alterada em cada link criado.</p>
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
              title='Url do app iOS'
              footerLabel='Alterações não afetam links já criados.'
              footerButtonOnClick={() =>
                form.handleSubmit(() =>
                  toast.promise(
                    async () => {
                      await editApp({
                        ...(form.formState.defaultValues as EditAppFormInput),
                        iosUrl: field.value,
                        id: app.id,
                      })

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
                )()
              }
            >
              <p>Url padrão que será utilizada ao criar um link.</p>

              <Input
                {...field}
                type='url'
                placeholder='https://apps.apple.com/app/exemplo/id1234567890'
              />

              <p className='text-muted-foreground'>Pode ser alterada em cada link criado.</p>
            </SettingsField>
          )}
        />

        <FormField
          control={form.control}
          name='defaultDisableIosPreviewPage'
          render={({ field, fieldState }) => (
            <SettingsField
              fieldState={fieldState}
              busy={busy}
              title='Página de pré-visualização iOS'
              footer={
                <span>
                  Alterações não afetam links já criados. Saiba mais sobre a{' '}
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
                Desativa a página de pré-visualização em dispositivos iOS, direcionando os usuários
                diretamente para a App Store.
              </p>

              <div className='flex items-center gap-2'>
                <Switch
                  onCheckedChange={checked => {
                    field.onChange(checked)

                    form.handleSubmit(() =>
                      toast.promise(
                        async () => {
                          await editApp({
                            ...(form.formState.defaultValues as EditAppFormInput),
                            defaultDisableIosPreviewPage: checked,
                            id: app.id,
                          })

                          form.resetField('defaultDisableIosPreviewPage', {
                            defaultValue: checked,
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
                  checked={field.value}
                  disabled={busy}
                />

                <span className='font-medium'>
                  {field.value ? 'Página Desativada' : 'Página Ativada'}
                </span>

                {busy && <Loader2Icon className='size-4 animate-spin' />}
              </div>
            </SettingsField>
          )}
        />

        <FormField
          control={form.control}
          name='defaultFallbackUrl'
          render={({ field, fieldState }) => (
            <SettingsField
              fieldState={fieldState}
              busy={busy}
              title='Url alternativa padrão'
              footerLabel='Alterações não afetam links já criados.'
              footerButtonOnClick={() =>
                form.handleSubmit(() =>
                  toast.promise(
                    async () => {
                      await editApp({
                        ...(form.formState.defaultValues as EditAppFormInput),
                        defaultFallbackUrl: field.value,
                        id: app.id,
                      })

                      form.resetField('defaultFallbackUrl', {
                        defaultValue: field.value,
                      })
                    },
                    {
                      loading: 'Alterando a url alternativa...',
                      success: 'Url alternativa alterada.',
                      error: 'Erro ao alterar a url alternativa.',
                    },
                  ),
                )()
              }
            >
              <span>
                Url alternativa padrão que será utilizada ao criar um link.
                <br />
                <br />É a url que o usuário será direcionado caso o dispositivo que abrir o link não
                seja nem Android e nem iOS, como por exemplo, um computador Windows, Linux ou macOS.
              </span>

              <Input
                {...field}
                type='url'
                placeholder='https://www.meusite.com'
                value={field.value || ''}
              />

              <p className='text-muted-foreground'>Pode ser alterada em cada link criado.</p>
            </SettingsField>
          )}
        />

        <FormField
          control={form.control}
          name='qrcodeLogoUrl'
          render={({ field, fieldState }) => (
            <SettingsField
              fieldState={fieldState}
              busy={busy}
              title='Url do logo do QR Code'
              footerButtonOnClick={() =>
                form.handleSubmit(() =>
                  toast.promise(
                    async () => {
                      await editApp({
                        ...(form.formState.defaultValues as EditAppFormInput),
                        qrcodeLogoUrl: field.value,
                        id: app.id,
                      })

                      form.resetField('qrcodeLogoUrl', {
                        defaultValue: field.value,
                      })
                    },
                    {
                      loading: 'Alterando a url da logo do QR Code...',
                      success: 'Url da logo do QR Code alterada.',
                      error: 'Erro ao alterar a url da logo do QR Code.',
                    },
                  ),
                )()
              }
            >
              <p>Url da imagem que será utilizada para inserir no centro do QR Code de um link.</p>

              <Input
                {...field}
                type='url'
                placeholder='https://www.meusite.com/logo.png'
                value={field.value || ''}
              />
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
