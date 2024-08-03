'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@prisma/client'
import ky from 'ky'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { CreateLinkInputProps, createLinkInputSchema } from '@/api/dtos'
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
    const link = await response.json<Link>()
    return link
  }

  const form = useForm<CreateLinkInputProps>({
    resolver: zodResolver(createLinkInputSchema),
    defaultValues: linkId
      ? async () => getLink(linkId)
      : {
          androidUrl: IS_DEVELOPMENT
            ? 'https://play.google.com/store/apps/details?id=com.quebarbada.quebarbada'
            : '',
          iosUrl: IS_DEVELOPMENT
            ? 'https://apps.apple.com/br/app/id1598991618?platform=iphone'
            : '',
          fallbackUrl: IS_DEVELOPMENT ? 'https://favorito.digital' : '',
        },
  })

  const isLoading = form.formState.isLoading

  const onSubmit = async (values: CreateLinkInputProps) => {
    try {
      setApiError(undefined)

      await ky.post('/api/links', {
        json: values,
      })

      form.reset()

      closeDialog()

      toast.success('Link criado com sucesso.')

      refresh()
    } catch (error) {
      const message = await getErrorMessage(error)
      setApiError(message)
    }
  }

  return (
    <>
      {apiError && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Ops!</AlertTitle>
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='slug'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link curto</FormLabel>
                <FormControl>
                  <div className='flex items-center gap-2'>
                    {/* TODO: Assign the edit link domain to the select */}
                    <Select defaultValue={LINK_DOMAINS[0]}>
                      <SelectTrigger className='w-60' id='short-link-domain'>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {LINK_DOMAINS.map((domain, index) => (
                          <SelectItem key={index} value={domain}>
                            {domain}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <span className='text-muted-foreground'>/</span>

                    <Input autoFocus placeholder='(opcional)' {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
            <Button type='submit' disabled={isLoading} className='min-w-28'>
              {!isLoading ? 'Criar link' : <Loader2 className='animate-spin' />}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}
