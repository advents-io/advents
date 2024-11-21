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
import { LoadingSpinner } from '@/components/loading-spinner'
import { SettingsField } from '@/components/settings-field'
import { Button } from '@/ui/button'
import { Form, FormField } from '@/ui/form'
import { Input } from '@/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { Switch } from '@/ui/switch'

import { DeleteAppButton } from './delete-app-button'
import Loading from './loading'

type Props = {
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
    onSuccess: () => {
      toast.success('App alterado com sucesso.')
    },
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
              footerButtonOnClick={() =>
                form.handleSubmit(async () => {
                  await editApp({
                    ...(form.formState.defaultValues as EditAppFormInput),
                    name: field.value,
                    id: app.id,
                  })

                  form.resetField('name', {
                    defaultValue: field.value,
                  })
                })()
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
              footerButtonOnClick={() =>
                form.handleSubmit(async () => {
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
                })()
              }
            >
              <p>Valor único usado para identificar o app na plataforma.</p>

              <Input {...field} placeholder='nome-do-app' />

              <p className='text-muted-foreground'>
                Deve conter apenas letras minúsculas, números, hífen ou underline.
              </p>
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
              footerLabel='Alterações não afetam links já criados.'
            >
              <p>
                Domínio que será pré preenchido ao criar um link. Para cada link será possível
                alterar o domínio.
              </p>

              <Select
                onValueChange={value => {
                  field.onChange(value)

                  form.handleSubmit(async () => {
                    await editApp({
                      ...(form.formState.defaultValues as EditAppFormInput),
                      defaultDomain: value,
                      id: app.id,
                    })

                    form.resetField('defaultDomain', {
                      defaultValue: value,
                    })
                  })()
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
                form.handleSubmit(async () => {
                  await editApp({
                    ...(form.formState.defaultValues as EditAppFormInput),
                    androidUrl: field.value,
                    id: app.id,
                  })

                  form.resetField('androidUrl', {
                    defaultValue: field.value,
                  })
                })()
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
                form.handleSubmit(async () => {
                  await editApp({
                    ...(form.formState.defaultValues as EditAppFormInput),
                    iosUrl: field.value,
                    id: app.id,
                  })

                  form.resetField('iosUrl', {
                    defaultValue: field.value,
                  })
                })()
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
              title='Desabilitar página de pré-visualização no iOS'
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

                    form.handleSubmit(async () => {
                      await editApp({
                        ...(form.formState.defaultValues as EditAppFormInput),
                        defaultDisableIosPreviewPage: checked,
                        id: app.id,
                      })

                      form.resetField('defaultDisableIosPreviewPage', {
                        defaultValue: checked,
                      })
                    })()
                  }}
                  checked={field.value}
                  disabled={busy}
                />

                <span className='font-semibold'>
                  {field.value ? 'Página Desativada' : 'Página Ativada'}
                </span>

                {busy && <Loader2Icon className='size-4 animate-spin' />}
              </div>

              <p>
                A página de pré-visualização melhora a precisão da atribuição em dispositivos iOS.
                Ao abrir um link, o usuário é direcionado para a página contendo um botão de ação
                que copia o identificador do link no clipboard do dispositivo. Ao abrir o app pela
                primeira vez, o identificador é lido, fazendo com que a atribuição seja garantida.
              </p>
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
                form.handleSubmit(async () => {
                  await editApp({
                    ...(form.formState.defaultValues as EditAppFormInput),
                    defaultFallbackUrl: field.value,
                    id: app.id,
                  })

                  form.resetField('defaultFallbackUrl', {
                    defaultValue: field.value,
                  })
                })()
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
                form.handleSubmit(async () => {
                  await editApp({
                    ...(form.formState.defaultValues as EditAppFormInput),
                    qrcodeLogoUrl: field.value,
                    id: app.id,
                  })

                  form.resetField('qrcodeLogoUrl', {
                    defaultValue: field.value,
                  })
                })()
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
                  <LoadingSpinner loading={busy}>Excluir app</LoadingSpinner>
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
