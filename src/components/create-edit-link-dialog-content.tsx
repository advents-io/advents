'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import ky from 'ky'
import { AlertCircle, Loader2, PlusCircle, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { CreateLinkInputProps, createLinkInputSchema } from '@/http/dtos/input'
import { GetLinkOutputProps } from '@/http/dtos/output'
import { Alert, AlertDescription, AlertTitle } from '@/ui/alert'
import { Button } from '@/ui/button'
import { DialogFooter } from '@/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Input } from '@/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { LINK_DOMAINS } from '@/utils/constants'
import { IS_DEVELOPMENT } from '@/utils/env'
import { getErrorMessage } from '@/utils/error-formatter'

interface Props {
  closeDialog: () => void
  linkId?: string
}

export const CreateEditLinkDialogContent = ({ closeDialog, linkId }: Props) => {
  const [apiError, setApiError] = useState<string>()
  const { refresh } = useRouter()

  const getLink = async (linkId: string) => {
    const response = await ky.get(`/api/links/${linkId}`)
    const link = await response.json<GetLinkOutputProps>()
    return link
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

  const onSubmit = async (values: CreateLinkInputProps) => {
    try {
      setApiError(undefined)

      if (linkId) {
        await ky.put(`/api/links/${linkId}`, {
          json: values,
        })
      } else {
        await ky.post('/api/links', {
          json: values,
        })
      }

      form.reset()

      closeDialog()

      toast.success(linkId ? 'Link alterado com sucesso.' : 'Link criado com sucesso.')

      refresh()
    } catch (error) {
      const message = await getErrorMessage(error)
      setApiError(message)
    }
  }

  return (
    <div className='relative space-y-4 pt-4'>
      {apiError && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Ops!</AlertTitle>
          <AlertDescription>{apiError}</AlertDescription>
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
                  <Input placeholder='Campanha com influencer (opcional)' {...field} />
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
                  <Input placeholder='https://acme.com' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type='submit' disabled={form.formState.isSubmitting} className='min-w-28'>
              {!form.formState.isSubmitting ? (
                linkId ? (
                  <>
                    <Save className='mr-2 h-4 w-4' />
                    Salvar
                  </>
                ) : (
                  <>
                    <PlusCircle className='mr-2 h-4 w-4' />
                    Criar link
                  </>
                )
              ) : (
                <Loader2 className='animate-spin' />
              )}
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
