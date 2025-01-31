'use client'

import { DOCS_URLS, routes } from '@advents/common'
import {
  createEditLinkFormInputSchema as actionCreateEditLinkFormInputSchema,
  createLinkAction,
  editLinkAction,
  formatErrors,
  generateAiSlugAction,
  generateRandomSlugAction,
  useAction,
} from '@advents/mutations'
import { GetAppDefaultValuesOutput, GetLinksAnalyticsOutput } from '@advents/queries/client'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  PlusIcon,
  SaveIcon,
  ShuffleIcon,
  SparklesIcon,
  SquareArrowOutUpRightIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { usePostHog } from 'posthog-js/react'
import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { ErrorAlert } from '@/components/error-alert'
import { IconButton } from '@/components/icon-button'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useStartEndDate } from '@/hooks/use-start-end-date'
import { getAppDefaultValues } from '@/lib/queries/get-app-default-values'
import { getAppDomains } from '@/lib/queries/get-app-domains'
import { getLink } from '@/lib/queries/get-link'
import { getQueryClient } from '@/lib/react-query'
import { cn } from '@/lib/tailwind'
import { Button } from '@/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Input } from '@/ui/input'
import { ResponsiveDialogFooter } from '@/ui/responsive-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { Separator } from '@/ui/separator'
import { Skeleton } from '@/ui/skeleton'

const createEditLinkFormInputSchema = actionCreateEditLinkFormInputSchema.extend({
  disableIosPreviewPage: z.union([
    z.literal('default'), //
    z.literal('true'),
    z.literal('false'),
  ]),
  isDefaultAndroidUrl: z.boolean(),
  isDefaultIosUrl: z.boolean(),
  isDefaultFallbackUrl: z.boolean(),
})

type CreateEditLinkFormInput = z.infer<typeof createEditLinkFormInputSchema>

interface Props extends HTMLAttributes<HTMLDivElement> {
  closeDialog: () => void
  linkId?: string
}

export const CreateEditLinkForm = ({ closeDialog, linkId, className }: Props) => {
  const { refresh } = useRouter()
  const { team: teamSlug, app: appSlug } = useParams<{ team: string; app: string }>()
  const [{ startDate, endDate }] = useStartEndDate()
  const posthog = usePostHog()

  const [defaultAppValues, setDefaultAppValues] = useState<GetAppDefaultValuesOutput>()

  const [availableDomains, setAvailableDomains] = useState<string[]>([])

  const onSuccess = () => {
    form.reset()
    closeDialog()
    toast.success(linkId ? 'Link alterado.' : 'Link criado.')
    refresh()
  }

  const {
    execute: createLink,
    isExecuting: isCreating,
    result: createLinkResult,
  } = useAction(createLinkAction, {
    onSuccess: ({ data }) => {
      posthog.capture('create_link', {
        title: data?.title,
        url: `${data?.domain}/${data?.slug}`,
        link_id: data?.id,
        app: appSlug,
      })

      onSuccess()
    },
  })

  const {
    execute: editLink,
    isExecuting: isEditing,
    result: editLinkResult,
  } = useAction(editLinkAction, {
    onSuccess: ({ data }) => {
      if (data) {
        getQueryClient().setQueryData<GetLinksAnalyticsOutput>(
          ['links-analytics', teamSlug, appSlug, startDate, endDate],
          prevLinks =>
            prevLinks?.map(prevLink =>
              prevLink.id === data.id
                ? {
                    ...prevLink,
                    ...data,
                  }
                : prevLink,
            ),
        )
      }

      onSuccess()
    },
  })

  const { execute: generateRandomSlug, isExecuting: isGeneratingRandomSlug } = useAction(
    generateRandomSlugAction,
    {
      onSuccess: ({ data }) => {
        if (!data) {
          return
        }

        form.setValue('slug', data.slug)

        posthog.capture('generate_random_slug', {
          domain,
          slug: data.slug,
          app: appSlug,
        })
      },
    },
  )

  const { execute: generateAiSlug, isExecuting: isGeneratingAiSlug } = useAction(
    generateAiSlugAction,
    {
      onSuccess: ({ data }) => {
        if (!data) {
          return
        }

        form.setValue('slug', data.slug)

        posthog.capture('generate_ai_slug', {
          title,
          domain,
          slug: data.slug,
          app: appSlug,
        })
      },
    },
  )

  const onSubmit = async (link: CreateEditLinkFormInput) => {
    link.androidUrl = link.isDefaultAndroidUrl ? null : link.androidUrl
    link.iosUrl = link.isDefaultIosUrl ? null : link.iosUrl
    link.fallbackUrl = link.isDefaultFallbackUrl ? null : link.fallbackUrl

    const disableIosPreviewPage =
      link.disableIosPreviewPage === 'default' ? null : link.disableIosPreviewPage === 'true'

    if (linkId) {
      editLink({
        ...link,
        disableIosPreviewPage,
        linkId,
      })
    } else {
      createLink({
        ...link,
        disableIosPreviewPage,
        appId: defaultAppValues!.id,
      })
    }
  }

  const error = formatErrors(createLinkResult) || formatErrors(editLinkResult)

  const handleGetLink = async (linkId: string): Promise<CreateEditLinkFormInput> => {
    const [link, app] = await Promise.all([
      getLink({ linkId }),
      getAppDefaultValues({ teamSlug, appSlug }),
    ])

    setDefaultAppValues(app)

    const availableDomains = await getAppDomains({ appId: app.id })
    setAvailableDomains(availableDomains.domains)

    return {
      ...link,
      androidUrl: link.androidUrl || app.androidUrl,
      iosUrl: link.iosUrl || app.iosUrl,
      fallbackUrl: link.fallbackUrl || app.fallbackUrl,
      disableIosPreviewPage: !link.disableIosPreviewPage
        ? 'default'
        : link.disableIosPreviewPage
          ? 'true'
          : 'false',
      isDefaultAndroidUrl: !link.androidUrl,
      isDefaultIosUrl: !link.iosUrl,
      isDefaultFallbackUrl: !link.fallbackUrl,
    }
  }

  const getDefaultLinkValues = async (): Promise<CreateEditLinkFormInput> => {
    const app = await getAppDefaultValues({ teamSlug, appSlug })
    setDefaultAppValues(app)

    const availableDomains = await getAppDomains({ appId: app.id })
    setAvailableDomains(availableDomains.domains)

    return {
      title: null,
      domain: app.defaultDomain,
      slug: '',
      androidUrl: app.androidUrl,
      iosUrl: app.iosUrl,
      disableIosPreviewPage: 'default',
      fallbackUrl: app.fallbackUrl,
      campaignCost: null,
      isDefaultAndroidUrl: true,
      isDefaultIosUrl: true,
      isDefaultFallbackUrl: true,
    }
  }

  const form = useForm<CreateEditLinkFormInput>({
    resolver: zodResolver(createEditLinkFormInputSchema),
    defaultValues: linkId
      ? async () => await handleGetLink(linkId)
      : async () => await getDefaultLinkValues(),
  })

  const isExecuting = isCreating || isEditing || form.formState.isSubmitting

  const domain = form.watch('domain')
  const slug = form.watch('slug')
  const title = form.watch('title')

  if (form.formState.isLoading) {
    return <Loading className={className} />
  }

  return (
    <div className={cn('space-y-4', className)}>
      <ErrorAlert error={error} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  tooltip='Título do link utilizado para melhor identificação na lista de links.'
                  optional
                >
                  Título
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder='Campanha com influencer João'
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex flex-col'>
            <FormLabel
              optional
              tooltip={
                <span>
                  Link curto utilizado para compartilhamento.
                  <br />
                  <span className='font-semibold text-primary'>
                    https://{domain}/{slug || 'abcd123'}
                  </span>
                  <br />
                  <br />
                  Você pode adicionar um domínio customizado nas{' '}
                  <Link
                    href={routes.SETTINGS_DOMAINS.path(teamSlug, appSlug)}
                    className='inline-flex items-center whitespace-pre text-blue-600 hover:underline'
                    target='_blank'
                  >
                    configurações do app. <SquareArrowOutUpRightIcon className='size-4' />
                  </Link>
                </span>
              }
            >
              Link curto
            </FormLabel>

            <div className='mt-2 flex flex-col gap-2 sm:flex-row sm:items-center'>
              <FormField
                control={form.control}
                name='domain'
                render={({ field }) => (
                  <FormItem className='w-full max-w-52'>
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
                  </FormItem>
                )}
              />

              <span className='hidden text-muted-foreground sm:block'>/</span>

              <div className='flex w-full items-center gap-1'>
                <FormField
                  control={form.control}
                  name='slug'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormControl>
                        <Input
                          autoFocus
                          placeholder='abcd123'
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <IconButton
                  disabled={!title}
                  isLoading={isGeneratingAiSlug}
                  onClick={() =>
                    generateAiSlug({
                      domain,
                      title: title!,
                    })
                  }
                  tooltip={
                    title
                      ? 'Gerar um link utilizando IA.'
                      : 'Preencha o título para gerar um link utilizando IA.'
                  }
                >
                  <SparklesIcon />
                </IconButton>

                <IconButton
                  isLoading={isGeneratingRandomSlug}
                  onClick={() => generateRandomSlug({ domain })}
                  tooltip='Gerar um link aleatório.'
                >
                  <ShuffleIcon />
                </IconButton>
              </div>
            </div>

            <FormMessage className='mt-1'>
              {form.formState.errors.domain?.message || form.formState.errors.slug?.message}
            </FormMessage>

            {linkId &&
              (form.formState.dirtyFields.domain || form.formState.dirtyFields.slug) &&
              !(form.formState.errors.domain || form.formState.errors.slug) && (
                <div className='mt-1 space-y-2 text-sm font-medium text-destructive'>
                  <p>
                    Ao alterar o domínio ou link curto, o endereço anterior do link deixará de
                    funcionar.
                  </p>

                  {form.getValues('slug') ? (
                    <p>
                      O novo endereço será:{' '}
                      <span className='rounded-md bg-gray-100 px-2 py-1 font-mono tracking-tighter text-primary'>
                        https://{form.getValues('domain')}/{form.getValues('slug')}
                      </span>
                    </p>
                  ) : (
                    <p>O novo endereço será gerado aleatoriamente ao salvar o link.</p>
                  )}
                </div>
              )}
          </div>

          <div>
            <FormLabel
              tooltip={
                <span>
                  Url utilizada para o direcionamento em dispositivos Android.
                  <br />
                  <br />
                  Você pode alterar a url padrão nas{' '}
                  <Link
                    href={routes.SETTINGS.path(teamSlug, appSlug)}
                    className='inline-flex items-center whitespace-pre text-blue-600 hover:underline'
                    target='_blank'
                  >
                    configurações do app <SquareArrowOutUpRightIcon className='size-4' />
                  </Link>
                  , ou utilizar uma url personalizada.
                </span>
              }
            >
              Url do app Android
            </FormLabel>

            <div className='mt-2 flex flex-col gap-2 sm:flex-row'>
              <FormField
                control={form.control}
                name='isDefaultAndroidUrl'
                render={({ field }) => (
                  <FormItem className='w-full max-w-36'>
                    <Select
                      {...field}
                      value={field.value.toString()}
                      onValueChange={value => {
                        field.onChange(value === 'true')
                        form.setValue('androidUrl', defaultAppValues!.androidUrl)
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent className='overflow-visible'>
                        <SelectItem
                          value='true'
                          tooltip='Url padrão informada na configuração do app.'
                        >
                          Padrão
                        </SelectItem>

                        <SelectItem value='false' tooltip='Usar url personalizada.'>
                          Personalizado
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='androidUrl'
                render={({ field }) => {
                  return (
                    <FormItem className='w-full'>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ''}
                          disabled={form.getValues('isDefaultAndroidUrl')}
                          placeholder='https://play.google.com/store/apps/details?id=com.exemplo.app'
                          type='url'
                        />
                      </FormControl>
                    </FormItem>
                  )
                }}
              />
            </div>

            <FormMessage className='mt-1'>
              {form.formState.errors.isDefaultAndroidUrl?.message ||
                form.formState.errors.androidUrl?.message}
            </FormMessage>
          </div>

          <div>
            <FormLabel
              tooltip={
                <span>
                  Url utilizada para o direcionamento em dispositivos iOS.
                  <br />
                  <br />
                  Você pode alterar a url padrão nas{' '}
                  <Link
                    href={routes.SETTINGS.path(teamSlug, appSlug)}
                    className='inline-flex items-center whitespace-pre text-blue-600 hover:underline'
                    target='_blank'
                  >
                    configurações do app <SquareArrowOutUpRightIcon className='size-4' />
                  </Link>
                  , ou utilizar uma url personalizada.
                </span>
              }
            >
              Url do app iOS
            </FormLabel>

            <div className='mt-2 flex flex-col gap-2 sm:flex-row'>
              <FormField
                control={form.control}
                name='isDefaultIosUrl'
                render={({ field }) => (
                  <FormItem className='w-full max-w-36'>
                    <Select
                      {...field}
                      value={field.value.toString()}
                      onValueChange={value => {
                        field.onChange(value === 'true')
                        form.setValue('iosUrl', defaultAppValues!.iosUrl)
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent className='overflow-visible'>
                        <SelectItem
                          value='true'
                          tooltip='Url padrão informada na configuração do app.'
                        >
                          Padrão
                        </SelectItem>

                        <SelectItem value='false' tooltip='Usar url personalizada.'>
                          Personalizado
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='iosUrl'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ''}
                        disabled={form.getValues('isDefaultIosUrl')}
                        placeholder='https://apps.apple.com/app/exemplo/id1234567890'
                        type='url'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormMessage className='mt-1'>
              {form.formState.errors.isDefaultIosUrl?.message ||
                form.formState.errors.iosUrl?.message}
            </FormMessage>
          </div>

          <FormField
            control={form.control}
            name='disableIosPreviewPage'
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  tooltip={
                    <span>
                      Ao desativar a página de pré-visualização em dispositivos iOS, os usuários
                      serão direcionados diretamente para a App Store.
                      <br />
                      <br />
                      A página de pré-visualização melhora a precisão da atribuição em dispositivos
                      iOS. Ao abrir um link, o usuário é direcionado para a página contendo um botão
                      de ação que copia o identificador do link no clipboard do dispositivo. Ao
                      abrir o app pela primeira vez, o identificador é lido, fazendo com que a
                      atribuição seja garantida.
                      <br />
                      <br />
                      Saiba mais{' '}
                      <Link
                        href={DOCS_URLS.IOS_PREVIEW_PAGE}
                        className='inline-flex items-center whitespace-pre text-blue-600 hover:underline'
                        target='_blank'
                      >
                        sobre a página de pré-visualização.{' '}
                        <SquareArrowOutUpRightIcon className='size-4' />
                      </Link>
                    </span>
                  }
                >
                  Página de pré-visualização iOS
                </FormLabel>

                <Select {...field} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className='w-full max-w-56'>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent className='overflow-visible'>
                    <SelectItem value='default'>
                      Padrão ({defaultAppValues!.disableIosPreviewPage ? 'Desativada' : 'Ativada'})
                    </SelectItem>

                    <SelectItem value='false'>Ativada</SelectItem>

                    <SelectItem value='true'>Desativada</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel
              tooltip={
                <span>
                  Url utilizada para o direcionamento em dispositivos Desktop.
                  <br />
                  <br />
                  Você pode alterar a url padrão nas{' '}
                  <Link
                    href={routes.SETTINGS.path(teamSlug, appSlug)}
                    className='inline-flex items-center whitespace-pre text-blue-600 hover:underline'
                    target='_blank'
                  >
                    configurações do app <SquareArrowOutUpRightIcon className='size-4' />
                  </Link>
                  , ou utilizar uma url personalizada.
                </span>
              }
            >
              Url alternativa
            </FormLabel>

            <div className='mt-2 flex flex-col gap-2 sm:flex-row'>
              <FormField
                control={form.control}
                name='isDefaultFallbackUrl'
                render={({ field }) => (
                  <FormItem className='w-full max-w-36'>
                    <Select
                      {...field}
                      value={field.value.toString()}
                      onValueChange={value => {
                        field.onChange(value === 'true')
                        form.setValue('fallbackUrl', defaultAppValues!.fallbackUrl)
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent className='overflow-visible'>
                        <SelectItem
                          value='true'
                          tooltip='Url padrão informada na configuração do app.'
                        >
                          Padrão
                        </SelectItem>

                        <SelectItem value='false' tooltip='Usar url personalizada.'>
                          Personalizado
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='fallbackUrl'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ''}
                        disabled={form.getValues('isDefaultFallbackUrl')}
                        placeholder='https://www.meusite.com'
                        type='url'
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormMessage className='mt-1'>
              {form.formState.errors.isDefaultFallbackUrl?.message ||
                form.formState.errors.fallbackUrl?.message}
            </FormMessage>
          </div>

          <div className='py-2'>
            <Separator />
          </div>

          <FormField
            control={form.control}
            name='campaignCost'
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  tooltip={
                    <span>
                      Valor investido na divulgação do link / campanha.
                      <br />
                      <br />
                      Esse valor é utilizado para calcular ROI, custo por clique, custo por
                      instalação, entre outros.
                    </span>
                  }
                  optional
                >
                  Custo da campanha
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder='R$ 100,00'
                    className='w-full max-w-40'
                    {...field}
                    value={
                      field.value !== null && field.value !== undefined
                        ? new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(Number(field.value))
                        : ''
                    }
                    onChange={e => {
                      // Remove non-numeric characters and convert to number
                      const value = e.target.value.replace(/[^0-9]/g, '')
                      field.onChange(value ? Number(value) / 100 : null)
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <ResponsiveDialogFooter>
            <Button type='submit' disabled={isExecuting}>
              <LoadingSpinner loading={isExecuting}>
                {linkId ? (
                  <>
                    <SaveIcon />
                    Salvar
                  </>
                ) : (
                  <>
                    <PlusIcon />
                    Criar link
                  </>
                )}
              </LoadingSpinner>
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </Form>
    </div>
  )
}

const Loading = ({ className }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('space-y-5', className)}>
      <div className='space-y-2'>
        <Skeleton className='h-[22px] w-40' />
        <Skeleton className='h-10 w-full' />
      </div>

      <div className='space-y-2'>
        <Skeleton className='h-[22px] w-40' />
        <div className='flex flex-col gap-2 sm:flex-row'>
          <Skeleton className='h-10 w-44' />
          <Skeleton className='h-10 w-full' />
        </div>
      </div>

      <div className='space-y-2'>
        <Skeleton className='h-[22px] w-40' />
        <div className='flex flex-col gap-2 sm:flex-row'>
          <Skeleton className='h-10 w-44' />
          <Skeleton className='h-10 w-full' />
        </div>
      </div>

      <div className='space-y-2'>
        <Skeleton className='h-[22px] w-40' />
        <div className='flex flex-col gap-2 sm:flex-row'>
          <Skeleton className='h-10 w-44' />
          <Skeleton className='h-10 w-full' />
        </div>
      </div>

      <div className='space-y-2'>
        <Skeleton className='h-[22px] w-40' />
        <Skeleton className='h-10 w-full' />
      </div>

      <div className='space-y-2'>
        <Skeleton className='h-[22px] w-40' />
        <div className='flex flex-col gap-2 sm:flex-row'>
          <Skeleton className='h-10 w-44' />
          <Skeleton className='h-10 w-full' />
        </div>
      </div>

      <div className='py-2'>
        <div className='h-[1px] w-full' />
      </div>

      <div className='space-y-2'>
        <Skeleton className='h-[22px] w-40' />
        <Skeleton className='h-10 w-44' />
      </div>

      <div className='flex justify-end'>
        <Skeleton className='h-10 w-full sm:w-[98px]' />
      </div>
    </div>
  )
}
