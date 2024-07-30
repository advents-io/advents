'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LINK_DOMAINS } from '@/utils/constants'

const createLinkSchema = z.object({
  slug: z.string().min(4),
  iosUrl: z.string().url().includes('apps.apple.com'),
  androidUrl: z.string().url().includes('play.google.com'),
  fallbackUrl: z.string().url(),
})

type CreateLinkType = z.infer<typeof createLinkSchema>

export const CreateLinkDialog = () => {
  const form = useForm<CreateLinkType>({
    resolver: zodResolver(createLinkSchema),
  })

  const onSubmit = async (values: CreateLinkType) => {
    await fetch('/api/links', {
      body: JSON.stringify(values),
      method: 'POST',
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='default' size='sm'>
          Criar link
        </Button>
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

                      <Input autoFocus id='short-link-slug' placeholder='slug' {...field} />
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
