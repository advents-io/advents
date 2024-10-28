'use client'

import { LINK_DOMAINS } from '@advents/common'
import {
  createLinkAction,
  CreateLinkInputFormProps,
  createLinkInputFormSchema,
  editLinkAction,
  formatErrors,
  getAppDefaultValuesAction,
  GetAppDefaultValuesOutputProps,
  getAppIdAction,
  getLinkAction,
  GetLinkOutputProps,
  useAction,
} from '@advents/mutations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Save } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ErrorAlert } from '@/components/error-alert'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useAnalyticsTableLinks } from '@/contexts/analytics-table-links-context'
import { Button } from '@/ui/button'
import { DialogFooter } from '@/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Input } from '@/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

interface Props {
  closeDialog: () => void
  linkId?: string
}

export const CreateEditLinkForm = ({ closeDialog, linkId }: Props) => {
  const { refresh } = useRouter()
  const { app: appSlug, team: teamSlug } = useParams<{ app: string; team: string }>()
  const { editLink: editAnalyticsTableLink } = useAnalyticsTableLinks()

  const [defaultAppValues, setDefaultAppValues] = useState<GetAppDefaultValuesOutputProps>()
  const [isDefaultAndroidUrl, setIsDefaultAndroidUrl] = useState(true)
  const [isDefaultIosUrl, setIsDefaultIosUrl] = useState(true)
  const [isDefaultFallbackUrl, setIsDefaultFallbackUrl] = useState(true)

  const hasDefaultFallbackUrl = !!defaultAppValues?.defaultFallbackUrl

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
        })
      }

      onSuccess()
    },
  })

  const onSubmit = async (link: CreateLinkInputFormProps) => {
    if (linkId) {
      editLink({
        ...link,
        linkId,
      })
    } else {
      const result = await getAppIdAction({ appSlug, teamSlug })
      const appId = result?.data

      if (!appId) {
        return
      }

      createLink({ ...link, appId: appId.id })
    }
  }

  const createLinkError = formatErrors(createLinkResult)
  const editLinkError = formatErrors(editLinkResult)
  const error = createLinkError || editLinkError

  const getLink = async (linkId: string) => {
    const [response, appResponse] = await Promise.all([
      getLinkAction({ linkId }),
      getAppDefaultValuesAction({ appSlug, teamSlug }),
    ])

    const link = response?.data as GetLinkOutputProps
    const app = appResponse?.data as GetAppDefaultValuesOutputProps
    setDefaultAppValues(app)

    setIsDefaultAndroidUrl(link.androidUrl === app.androidUrl)
    setIsDefaultIosUrl(link.iosUrl === app.iosUrl)
    setIsDefaultFallbackUrl(!!app.defaultFallbackUrl && link.fallbackUrl === app.defaultFallbackUrl)

    return link
  }

  const getDefaultLinkValues = async () => {
    const response = await getAppDefaultValuesAction({ appSlug, teamSlug })
    const app = response?.data as GetAppDefaultValuesOutputProps
    setDefaultAppValues(app)

    setIsDefaultFallbackUrl(!!app.defaultFallbackUrl)

    return {
      title: null,
      domain: app.defaultDomain,
      androidUrl: app.androidUrl,
      iosUrl: app.iosUrl,
      fallbackUrl: app.defaultFallbackUrl || '',
    }
  }

  const form = useForm<CreateLinkInputFormProps>({
    resolver: zodResolver(createLinkInputFormSchema),
    defaultValues: linkId
      ? async () => await getLink(linkId)
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

  return (
    <div className='relative space-y-4 pt-4'>
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
                    value={field.value || undefined}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex flex-col'>
            <FormLabel
              className='mb-2'
              optional
              tooltip={
                <span className='leading-loose text-muted-foreground'>
                  Link curto utilizado para compartilhamento.
                  <br />
                  <span className='font-semibold text-primary'>
                    https://{form.getValues('domain')}/{form.getValues('slug') || 'abcd123'}
                  </span>
                </span>
              }
            >
              Link curto
            </FormLabel>

            <div className='flex items-center gap-2'>
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
                        {LINK_DOMAINS.map((domain, index) => (
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
                <FormLabel tooltip='Url utilizada para o direcionamento em dispositivos Android.'>
                  Url do app Android
                </FormLabel>

                <div className='flex gap-2'>
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
                <FormLabel tooltip='Url utilizada para o direcionamento em dispositivos iOS.'>
                  Url do app iOS
                </FormLabel>

                <div className='flex gap-2'>
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
                <FormLabel tooltip='Url utilizada para o direcionamento em dispositivos que não sejam Android ou iOS.'>
                  Url alternativa
                </FormLabel>

                <div className='flex gap-2'>
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

          <DialogFooter>
            <Button type='submit' disabled={isExecuting}>
              <LoadingSpinner loading={isExecuting}>
                {linkId ? (
                  <>
                    <Save className='size-4' />
                    Salvar
                  </>
                ) : (
                  <>
                    <Plus className='size-4' />
                    Criar link
                  </>
                )}
              </LoadingSpinner>
            </Button>
          </DialogFooter>
        </form>
      </Form>

      {form.formState.isLoading && (
        <div className='absolute -inset-2 flex items-center justify-center bg-white'>
          <Loader2 className='animate-spin' />
        </div>
      )}
    </div>
  )
}
