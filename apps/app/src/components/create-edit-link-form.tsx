'use client'

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
} from '@advents/actions'
import { LINK_DOMAINS } from '@advents/common'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Save } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ErrorAlert } from '@/components/error-alert'
import { LoadingSpinner } from '@/components/loading-spinner'
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
    onSuccess,
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
    const response = await getLinkAction({ linkId })
    return response?.data as GetLinkOutputProps
  }

  const getDefaultLinkValues = async () => {
    const response = await getAppDefaultValuesAction({ appSlug, teamSlug })
    const app = response?.data as GetAppDefaultValuesOutputProps

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
                <FormLabel optional>Título</FormLabel>
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
            <FormLabel className='mb-2' optional>
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
                <FormLabel>Url do app Android</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='https://play.google.com/store/apps/details?id=com.exemplo.app'
                    type='url'
                  />
                </FormControl>
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
                    placeholder='https://apps.apple.com/app/exemplo/id1234567890'
                    type='url'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='fallbackUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Url alternativa</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='https://www.meusite.com' type='url' />
                </FormControl>
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
