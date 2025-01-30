'use client'

import { routes } from '@advents/common'
import {
  editAppDefaultDomainAction,
  EditAppDefaultDomainFormInput,
  editAppDefaultDomainFormInputSchema,
  formatErrors,
  useAction,
} from '@advents/mutations'
import { Domain } from '@advents/queries/server'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon, SquareArrowOutUpRightIcon } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ErrorAlert } from '@/components/error-alert'
import { SettingsField } from '@/components/settings-field'
import { Form, FormField } from '@/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

interface Props {
  availableDomains: Domain[]
  defaultDomain: string
}

export const EditDefaultDomainForm = ({ availableDomains, defaultDomain }: Props) => {
  const { team: teamSlug, app: appSlug } = useParams<{ team: string; app: string }>()

  const {
    executeAsync: editAppDefaultDomain,
    isExecuting,
    result,
  } = useAction(editAppDefaultDomainAction, {
    onError: () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
  })

  const error = formatErrors(result)

  const form = useForm<EditAppDefaultDomainFormInput>({
    resolver: zodResolver(editAppDefaultDomainFormInputSchema),
    defaultValues: {
      defaultDomain,
    },
  })

  const busy = isExecuting || form.formState.isSubmitting

  return (
    <Form {...form}>
      <form className='space-y-10'>
        <ErrorAlert error={error} />

        <FormField
          control={form.control}
          name='defaultDomain'
          render={({ field, fieldState }) => (
            <SettingsField
              fieldState={fieldState}
              busy={busy}
              title='Domínio padrão'
              footer={
                <span>
                  Alterações não afetam links já criados. Adicione um domínio customizado na{' '}
                  <Link
                    href={routes.SETTINGS_DOMAINS.path(teamSlug, appSlug)}
                    className='inline-flex items-center whitespace-pre text-blue-600 hover:underline'
                    target='_blank'
                  >
                    página de domínios. <SquareArrowOutUpRightIcon className='size-4' />
                  </Link>
                </span>
              }
            >
              <p>
                Domínio que será pré preenchido ao criar um link. Para cada link será possível
                alterar o domínio.
              </p>

              <Select
                onValueChange={value => {
                  field.onChange(value)

                  form.handleSubmit(() =>
                    toast.promise(
                      async () => {
                        const result = await editAppDefaultDomain({
                          teamSlug,
                          appSlug,
                          defaultDomain: value,
                        })

                        if (result?.serverError) {
                          throw new Error()
                        }

                        form.resetField('defaultDomain', {
                          defaultValue: value,
                        })
                      },
                      {
                        loading: 'Alterando o domínio padrão...',
                        success: 'Domínio padrão alterado.',
                        error: 'Erro ao alterar o domínio padrão.',
                      },
                    ),
                  )()
                }}
                defaultValue={field.value}
                disabled={busy}
                {...field}
              >
                <SelectTrigger className='relative'>
                  <SelectValue />

                  {busy && (
                    <div className='absolute right-3 z-10 bg-white'>
                      <Loader2Icon className='size-4 animate-spin' />
                    </div>
                  )}
                </SelectTrigger>

                <SelectContent>
                  {availableDomains.map((domain, index) => (
                    <SelectItem key={index} value={domain.domain}>
                      {domain.domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <p className='text-muted-foreground'>
                Exemplo do link com domínio:{' '}
                <span className='font-mono font-semibold tracking-tighter text-primary'>
                  https://{field.value}/7yB46jk
                </span>
              </p>
            </SettingsField>
          )}
        />
      </form>
    </Form>
  )
}
