'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2, PlusCircle, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { createLinkAction } from '@/actions/link/create-link-action'
import { editLinkAction } from '@/actions/link/edit-link-action'
import { getLinkAction } from '@/actions/link/get-link-action'
import { formatErrors } from '@/actions/safe-action'
import {
  CreateLinkInputProps,
  createLinkInputSchema,
} from '@/actions/schemas/input/link/create-link-input'
import { GetLinkOutputProps } from '@/actions/schemas/output/link/get-link-output'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Alert, AlertDescription, AlertTitle } from '@/ui/alert'
import { Button } from '@/ui/button'
import { DialogFooter } from '@/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Input } from '@/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { LINK_DOMAINS } from '@/utils/constants'
import { IS_DEVELOPMENT } from '@/utils/env'

interface Props {
  closeDialog: () => void
  linkId?: string
}

export const CreateEditLinkDialogContent = ({ closeDialog, linkId }: Props) => {
  const { refresh } = useRouter()

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

  const isExecuting = isCreating || isEditing

  const onSubmit = (link: CreateLinkInputProps) => {
    if (linkId) {
      editLink({
        ...link,
        linkId,
      })
    } else {
      createLink(link)
    }
  }

  const createLinkError = formatErrors(createLinkResult)
  const editLinkError = formatErrors(editLinkResult)
  const error = createLinkError || editLinkError

  const getLink = async (linkId: string) => {
    const response = await getLinkAction({ linkId })
    return response?.data as GetLinkOutputProps
  }

  const defaultDomain = LINK_DOMAINS[0]

  const form = useForm<CreateLinkInputProps>({
    resolver: zodResolver(createLinkInputSchema),
    defaultValues: linkId
      ? async () => getLink(linkId)
      : {
          domain: defaultDomain,
          slug: '',
          androidUrl: IS_DEVELOPMENT
            ? 'https://play.google.com/store/apps/details?id=com.quebarbada.quebarbada'
            : '',
          iosUrl: IS_DEVELOPMENT
            ? 'https://apps.apple.com/br/app/id1598991618?platform=iphone'
            : '',
          fallbackUrl: IS_DEVELOPMENT ? 'https://favorito.digital' : '',
        },
  })

  return (
    <div className='relative space-y-4 pt-4'>
      {error && (
        <Alert variant='destructive'>
          <AlertCircle className='size-4' />
          <AlertTitle>Ops!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Campanha com influencer (opcional)'
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex flex-col'>
            <FormLabel className='mb-3'>Link curto</FormLabel>

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
                      <Input autoFocus placeholder='(opcional)' {...field} />
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
                    placeholder='https://play.google.com/store/apps/details?id=com.exemplo.app'
                    type='url'
                    {...field}
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
                    placeholder='https://apps.apple.com/br/app/exemplo-app/id123456789'
                    type='url'
                    {...field}
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
                  <Input placeholder='https://acme.com' type='url' {...field} />
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
                    <PlusCircle className='size-4' />
                    Criar link
                  </>
                )}
              </LoadingSpinner>
            </Button>
          </DialogFooter>
        </form>
      </Form>

      {linkId && form.formState.isLoading && (
        <div className='absolute -inset-2 flex items-center justify-center bg-white'>
          <Loader2 className='animate-spin' />
        </div>
      )}
    </div>
  )
}
