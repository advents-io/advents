'use client'

import {
  addCustomDomainAction,
  AddCustomDomainFormInput,
  addCustomDomainFormSchema,
  formatErrors,
  useAction,
} from '@advents/mutations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ErrorAlert } from '@/components/error-alert'
import { LoadingContent } from '@/components/loading-content'
import { SettingsField } from '@/components/settings-field'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/ui/alert-dialog'
import { Button } from '@/ui/button'
import { Form, FormField } from '@/ui/form'
import { Input } from '@/ui/input'

export const AddCustomDomainForm = () => {
  const { team: teamSlug, app: appSlug } = useParams<{ team: string; app: string }>()
  const [alertIsOpen, setAlertIsOpen] = useState(false)

  const {
    execute: addCustomDomain,
    result,
    isExecuting,
  } = useAction(addCustomDomainAction, {
    onSuccess: ({ data }) => {
      if (data) {
        window.open(data.whatsappUrl, '_blank')
      }

      form.reset()
      setAlertIsOpen(true)
    },
    onError: () => {
      toast.error('Erro ao adicionar domínio.')
    },
  })

  const form = useForm<AddCustomDomainFormInput>({
    resolver: zodResolver(addCustomDomainFormSchema),
    defaultValues: {
      domain: '',
    },
  })

  const handleAddCustomDomain = (data: AddCustomDomainFormInput) => {
    addCustomDomain({ ...data, teamSlug, appSlug })
  }

  const error = formatErrors(result)

  const busy = isExecuting || form.formState.isSubmitting

  return (
    <>
      <AlertDialog open={alertIsOpen} onOpenChange={setAlertIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Domínio customizado {form.watch('domain')}</AlertDialogTitle>

            <AlertDialogDescription>
              Finalize o processo enviando a mensagem por WhatsApp.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Ok</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAddCustomDomain)} className='space-y-10'>
          <ErrorAlert error={error} />

          <FormField
            control={form.control}
            name='domain'
            render={({ field, fieldState }) => (
              <SettingsField fieldState={fieldState} title='Domínios Customizados'>
                <span>Adicione um domínio customizado da sua empresa para utilizar nos links.</span>

                <div className='flex flex-col gap-2 sm:flex-row'>
                  <Input placeholder='links.meuapp.com' {...field} />

                  <Button type='submit' disabled={busy}>
                    <LoadingContent loading={busy}>Adicionar domínio</LoadingContent>
                  </Button>
                </div>
              </SettingsField>
            )}
          />
        </form>
      </Form>
    </>
  )
}
