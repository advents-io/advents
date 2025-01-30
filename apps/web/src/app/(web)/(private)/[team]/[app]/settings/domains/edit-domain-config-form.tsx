'use client'

import {
  editAppDomainConfigAction,
  EditAppDomainConfigFormInput,
  editAppDomainConfigFormInputSchema,
  formatErrors,
  useAction,
} from '@advents/mutations'
import { Domain } from '@advents/queries/server'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ErrorAlert } from '@/components/error-alert'
import { SettingsField } from '@/components/settings-field'
import { Form, FormField } from '@/ui/form'
import { SlugInput } from '@/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

interface Props {
  availableDomains: Domain[]
  defaultDomain: string
  subDomain: string
}

export const EditDomainConfigForm = ({ availableDomains, defaultDomain, subDomain }: Props) => {
  const { team: teamSlug, app: appSlug } = useParams<{ team: string; app: string }>()

  const {
    executeAsync: editAppDomainConfig,
    isExecuting,
    result,
  } = useAction(editAppDomainConfigAction, {
    onError: () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
  })

  const error = formatErrors(result)

  const form = useForm<EditAppDomainConfigFormInput>({
    resolver: zodResolver(editAppDomainConfigFormInputSchema),
    defaultValues: {
      defaultDomain,
      subDomain,
    },
  })

  const busy = isExecuting || form.formState.isSubmitting

  return (
    <Form {...form}>
      <form className='space-y-10'>
        <ErrorAlert error={error} />

        <FormField
          control={form.control}
          name='subDomain'
          render={({ field, fieldState }) => (
            <SettingsField
              fieldState={fieldState}
              busy={busy}
              title='Sub-domínio'
              footerLabel='Deve conter apenas letras minúsculas, números, hífen ou underline. Máximo de 48 caracteres.'
              footerButtonOnClick={form.handleSubmit(() =>
                toast.promise(
                  async () => {
                    const result = await editAppDomainConfig({
                      ...(form.formState.defaultValues as EditAppDomainConfigFormInput),
                      teamSlug,
                      appSlug,
                      subDomain: field.value,
                    })

                    if (result?.serverError) {
                      throw new Error()
                    }

                    form.resetField('subDomain', {
                      defaultValue: field.value,
                    })
                  },
                  {
                    loading: 'Alterando o sub-domínio...',
                    success: 'Sub-domínio alterado.',
                    error: 'Erro ao alterar o sub-domínio.',
                  },
                ),
              )}
            >
              Sub-domínio personalizado que será utilizado para criar os links.
              <SlugInput suffix='.adv.sh' {...field} placeholder='nome-do-app' maxLength={48} />
            </SettingsField>
          )}
        />

        <FormField
          control={form.control}
          name='defaultDomain'
          render={({ field, fieldState }) => (
            <SettingsField
              fieldState={fieldState}
              busy={busy}
              title='Domínio padrão'
              footerLabel='Alterações não afetam links já criados.'
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
                        const result = await editAppDomainConfig({
                          ...(form.formState.defaultValues as EditAppDomainConfigFormInput),
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
