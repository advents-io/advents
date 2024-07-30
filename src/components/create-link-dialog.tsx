'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { CreateLinkProps, createLinkSchema } from '@/schemas/link'
import { Button } from '@/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Input } from '@/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { useToast } from '@/ui/use-toast'
import { LINK_DOMAINS } from '@/utils/constants'
import { IS_DEVELOPMENT } from '@/utils/env'

export const CreateLinkDialog = () => {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const form = useForm<CreateLinkProps>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      androidUrl: IS_DEVELOPMENT
        ? 'https://play.google.com/store/apps/details?id=com.quebarbada.quebarbada'
        : '',
      iosUrl: IS_DEVELOPMENT ? 'https://apps.apple.com/br/app/id1598991618?platform=iphone' : '',
      fallbackUrl: IS_DEVELOPMENT ? 'https://favorito.digital' : '',
    },
  })

  const onSubmit = async (values: CreateLinkProps) => {
    const result = await fetch('/api/links', {
      body: JSON.stringify(values),
      method: 'POST',
    })

    if (result.ok) {
      form.reset()

      setOpen(false)

      toast({
        title: 'Link foi criado com sucesso.',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='lg'>Criar link</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar novo link</DialogTitle>
        </DialogHeader>

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

            <Button type='submit'>Criar link</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
