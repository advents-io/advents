'use client'

import { DISCORD_WEBHOOKS } from '@advents/common'
import { formatErrors, sendDiscordMessageAction, useAction } from '@advents/mutations'
import { getSessionUser } from '@advents/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { MessageSquareMoreIcon, StarIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { ErrorAlert } from '@/components/error-alert'
import { LoadingContent } from '@/components/loading-content'
import { cn } from '@/lib/tailwind'
import { Button } from '@/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover'
import { Textarea } from '@/ui/textarea'

const feedbackSchema = z.object({
  text: z.string(),
  rating: z.number().min(1).max(5).optional(),
})

type Feedback = z.infer<typeof feedbackSchema>

export const FeedbackButton = () => {
  const [open, setOpen] = useState(false)

  const {
    execute: sendDiscordMessage,
    isExecuting: isSending,
    result: sendDiscordMessageResult,
  } = useAction(sendDiscordMessageAction, {
    onSuccess: () => {
      setOpen(false)
      toast.success('Feedback enviado!')
      form.reset()
    },
    onError: () => {
      setOpen(false)
      toast.error('Erro ao enviar feedback.')
    },
  })

  const handleSendFeedback = async (feedback: Feedback) => {
    const user = await getSessionUser()

    const message = [
      '📝 **Novo Feedback**',
      '',
      `Usuário: **${user?.email || 'Anônimo'}**`,
      feedback.rating ? '⭐'.repeat(feedback.rating) + '\n' : '',
      '```',
      feedback.text,
      '```',
    ].join('\n')

    sendDiscordMessage({ message, webhookUrl: DISCORD_WEBHOOKS.FEEDBACK })
  }

  const form = useForm<Feedback>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      text: '',
    },
  })

  const error = formatErrors(sendDiscordMessageResult)

  const busy = isSending || form.formState.isSubmitting

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='hidden bg-gray-50 font-normal sm:flex'>
          <MessageSquareMoreIcon />
          Feedback
        </Button>
      </PopoverTrigger>

      <PopoverContent align='end' className='w-80'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSendFeedback)} className='space-y-4'>
            <ErrorAlert error={error} />

            <FormField
              control={form.control}
              name='text'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='Como podemos melhorar?'
                      required
                      className='resize-none'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-between'>
              <div className='flex gap-1'>
                {[1, 2, 3, 4, 5].map(value => (
                  <button
                    key={value}
                    type='button'
                    onClick={() =>
                      form.setValue(
                        'rating',
                        value !== form.getValues('rating') ? value : undefined,
                      )
                    }
                    className='focus:outline-none'
                  >
                    <StarIcon
                      className={cn(
                        'size-6 transition-colors',
                        (form.watch('rating') ?? -1) >= value
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground',
                      )}
                    />
                  </button>
                ))}
              </div>

              <Button
                type='submit'
                size='sm'
                disabled={form.getValues('text').length === 0 || busy}
              >
                <LoadingContent loading={busy}>Enviar</LoadingContent>
              </Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}
