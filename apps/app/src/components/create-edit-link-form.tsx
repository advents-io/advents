'use client'

import { routes } from '@advents/common'
import {
  createLinkAction,
  CreateLinkFormInput,
  createLinkFormInputSchema,
  editLinkAction,
  formatErrors,
  useAction,
} from '@advents/mutations'
import { GetAppDefaultValuesOutput } from '@advents/queries/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon, SaveIcon, SquareArrowOutUpRightIcon } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ErrorAlert } from '@/components/error-alert'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useAnalyticsTableLinks } from '@/contexts/analytics-table-links-context'
import { getAppDefaultValues } from '@/lib/queries/get-app-default-values'
import { getAppDomains } from '@/lib/queries/get-app-domains'
import { getLink } from '@/lib/queries/get-link'
import { Button } from '@/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Input } from '@/ui/input'
import { ResponsiveDialogFooter } from '@/ui/responsive-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { Separator } from '@/ui/separator'
import { Skeleton } from '@/ui/skeleton'

interface Props {
  closeDialog: () => void
  linkId?: string
}

export const CreateEditLinkForm = ({ closeDialog, linkId }: Props) => {
  const { refresh } = useRouter()
  const { app: appSlug, team: teamSlug } = useParams<{ app: string; team: string }>()
  const { editLink: editAnalyticsTableLink } = useAnalyticsTableLinks()

  const [defaultAppValues, setDefaultAppValues] = useState<GetAppDefaultValuesOutput>()
  const [isDefaultAndroidUrl, setIsDefaultAndroidUrl] = useState(true)
  const [isDefaultIosUrl, setIsDefaultIosUrl] = useState(true)
  const [isDefaultFallbackUrl, setIsDefaultFallbackUrl] = useState(true)

  const hasDefaultFallbackUrl = !!defaultAppValues?.defaultFallbackUrl

  const [availableDomains, setAvailableDomains] = useState<string[]>([])

  const onSuccess = () => {
    form.reset()
    closeDialog()
    toast.success(linkId ? 'Link alterado com sucesso.' : 'Link criado com sucesso.')
    refresh()
  }

  const {
    execute: createLink,
    isExecuting: isCreating,
    result: createLinkResult,
  } = useAction(createLinkAction, {
    onSuccess,
  })

  const {
    execute: editLink,
    isExecuting: isEditing,
    result: editLinkResult,
  } = useAction(editLinkAction, {
    onSuccess: ({ data }) => {
      if (editAnalyticsTableLink && data) {
        editAnalyticsTableLink({
          id: data.id,
          title: data.title,
          domain: data.domain,
          slug: data.slug,
          campaignCost: data.campaignCost,
        })
      }

      onSuccess()
    },
  })

  const onSubmit = async (link: CreateLinkFormInput) => {
    if (linkId) {
      editLink({
        ...link,
        linkId,
      })
    } else {
      createLink({
        ...link,
        appId: defaultAppValues!.id,
      })
    }
  }

  const createLinkError = formatErrors(createLinkResult)
  const editLinkError = formatErrors(editLinkResult)
  const error = createLinkError || editLinkError

  const handleGetLink = async (linkId: string) => {
    const [link, app] = await Promise.all([
      getLink({ linkId }),
      getAppDefaultValues({ appSlug, teamSlug }),
    ])

    setDefaultAppValues(app)

    setIsDefaultAndroidUrl(link.androidUrl === app.androidUrl)
    setIsDefaultIosUrl(link.iosUrl === app.iosUrl)
    setIsDefaultFallbackUrl(!!app.defaultFallbackUrl && link.fallbackUrl === app.defaultFallbackUrl)

    const availableDomains = await getAppDomains({ appId: app.id })
    setAvailableDomains(availableDomains.domains)

    return link
  }

  const getDefaultLinkValues = async () => {
    const app = await getAppDefaultValues({ appSlug, teamSlug })
    setDefaultAppValues(app)

    setIsDefaultFallbackUrl(!!app.defaultFallbackUrl)

    const availableDomains = await getAppDomains({ appId: app.id })
    setAvailableDomains(availableDomains.domains)

    return {
      title: null,
      domain: app.defaultDomain,
      androidUrl: app.androidUrl,
      iosUrl: app.iosUrl,
      fallbackUrl: app.defaultFallbackUrl || '',
      campaignCost: null,
    }
  }

  const form = useForm<CreateLinkFormInput>({
    resolver: zodResolver(createLinkFormInputSchema),
    defaultValues: linkId
      ? async () => await handleGetLink(linkId)
      : async () => await getDefaultLinkValues(),
  })

  const changeAndroidUrlType = (value: string) => {
    const isDefault = value === 'true'

    setIsDefaultAndroidUrl(isDefault)

    if (defaultAppValues && isDefault) {
      form.setValue('androidUrl', defaultAppValues.androidUrl)
    }
  }

  const changeIosUrlType = (value: string) => {
    const isDefault = value === 'true'

    setIsDefaultIosUrl(isDefault)

    if (defaultAppValues && isDefault) {
      form.setValue('iosUrl', defaultAppValues.iosUrl)
    }
  }

  const changeFallbackUrlType = (value: string) => {
    const isDefault = value === 'true'

    setIsDefaultFallbackUrl(isDefault)

    if (defaultAppValues && isDefault && defaultAppValues.defaultFallbackUrl) {
      form.setValue('fallbackUrl', defaultAppValues.defaultFallbackUrl)
    }
  }

  const isExecuting = isCreating || isEditing || form.formState.isSubmitting

  if (form.formState.isLoading) {
    return <Loading />
  }

  return (
    <div className='space-y-4 pt-4'>
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
                    https://{form.getValues('domain')}/{form.getValues('slug') || 'abcd123'}
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

            <div className='mt-2 flex items-center gap-2'>
              <FormField
                control={form.control}
                name='domain'
                render={({ field }) => (
                  <FormItem className='w-60'>
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

              <span className='text-muted-foreground'>/</span>

              <FormField
                control={form.control}
                name='slug'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormControl>
                      <Input autoFocus placeholder='abcd123' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormMessage className='mt-1'>
              {form.formState.errors.domain?.message || form.formState.errors.slug?.message}
            </FormMessage>
          </div>

          <FormField
            control={form.control}
            name='androidUrl'
            render={({ field }) => (
              <FormItem>
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

                <div className='flex flex-col gap-2 sm:flex-row'>
                  <Select
                    onValueChange={changeAndroidUrlType}
                    value={isDefaultAndroidUrl.toString()}
                  >
                    <SelectTrigger className='w-44'>
                      <SelectValue />
                    </SelectTrigger>

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

                  <FormControl>
                    <Input
                      {...field}
                      className='w-full'
                      disabled={isDefaultAndroidUrl}
                      placeholder='https://play.google.com/store/apps/details?id=com.exemplo.app'
                      type='url'
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='iosUrl'
            render={({ field }) => (
              <FormItem>
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

                <div className='flex flex-col gap-2 sm:flex-row'>
                  <Select onValueChange={changeIosUrlType} value={isDefaultIosUrl.toString()}>
                    <SelectTrigger className='w-44'>
                      <SelectValue />
                    </SelectTrigger>

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

                  <FormControl>
                    <Input
                      {...field}
                      disabled={isDefaultIosUrl}
                      placeholder='https://apps.apple.com/app/exemplo/id1234567890'
                      type='url'
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='fallbackUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  tooltip={
                    <span>
                      Url utilizada para o direcionamento em dispositivos que não sejam Android ou
                      iOS.
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

                <div className='flex flex-col gap-2 sm:flex-row'>
                  {hasDefaultFallbackUrl && (
                    <Select
                      onValueChange={changeFallbackUrlType}
                      value={isDefaultFallbackUrl.toString()}
                    >
                      <SelectTrigger className='w-44'>
                        <SelectValue />
                      </SelectTrigger>

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
                  )}

                  <FormControl>
                    <Input
                      {...field}
                      disabled={isDefaultFallbackUrl}
                      placeholder='https://www.meusite.com'
                      type='url'
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    className='w-40'
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

const Loading = () => {
  return (
    <div className='space-y-5 pt-4'>
      <div className='space-y-2'>
        <Skeleton className='h-[22px] w-40' />
        <Skeleton className='h-10 w-full' />
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
