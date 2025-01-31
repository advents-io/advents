'use client'

import { AndroidCertFingerprint, App, IosBundleId } from '@advents/db'
import {
  editAndroidAppLinksAction,
  editIosUniversalLinksAction,
  editSchemeAction,
  formatErrors,
  useAction,
} from '@advents/mutations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { ErrorAlert } from '@/components/error-alert'
import { SettingsField } from '@/components/settings-field'
import { Button } from '@/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Input } from '@/ui/input'
import { Switch } from '@/ui/switch'

const formSchema = z
  .object({
    scheme: z
      .string()
      .regex(/^[a-z0-9]+:\/\/$/, 'Deve terminar com :// (ex: ifood://)')
      .nullable()
      .or(z.literal(''))
      .transform(value => value || null),
    enableIosUniversalLinks: z.boolean(),
    iosBundleIds: z.array(
      z.object({
        id: z.string().nullable(),
        bundleId: z
          .string()
          .regex(/^[a-z0-9.-]+\.[a-z0-9.-]+$/, 'Formato inválido.')
          .or(z.literal('')),
      }),
    ),
    appleTeamId: z.string().nullable(),
    enableAndroidAppLinks: z.boolean(),
    androidCertFingerprints: z.array(
      z.object({
        id: z.string().nullable(),
        sha256Fingerprint: z.string().or(z.literal('')),
      }),
    ),
  })
  .refine(
    data => {
      if (data.enableIosUniversalLinks) {
        return !!data.appleTeamId && data.iosBundleIds.length > 0
      }

      return true
    },
    {
      message:
        'O ID da equipe Apple e pelo menos um iOS Bundle Identifier são necessários quando o Universal Links está habilitado.',
      path: ['enableIosUniversalLinks'],
    },
  )
  .refine(
    data => {
      if (data.enableAndroidAppLinks) {
        return data.androidCertFingerprints.length > 0
      }

      return true
    },
    {
      message:
        'Pelo menos um Android SHA256 Fingerprint é necessário quando o Android App Links está habilitado.',
      path: ['enableAndroidAppLinks'],
    },
  )

type FormSchema = z.infer<typeof formSchema>

interface Props {
  app: Pick<
    App,
    'id' | 'scheme' | 'enableAndroidAppLinks' | 'enableIosUniversalLinks' | 'appleTeamId'
  > & {
    iosBundleIds: Array<Pick<IosBundleId, 'id' | 'bundleId'>>
    androidCertFingerprints: Array<Pick<AndroidCertFingerprint, 'id' | 'sha256Fingerprint'>>
  }
}

export const DeepLinkingForm = ({ app }: Props) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...app,
      iosBundleIds:
        app.iosBundleIds?.length > 0
          ? app.iosBundleIds
          : [
              {
                id: null,
                bundleId: '',
              },
            ],
      androidCertFingerprints:
        app.androidCertFingerprints?.length > 0
          ? app.androidCertFingerprints
          : [
              {
                id: null,
                sha256Fingerprint: '',
              },
            ],
    },
  })

  const {
    executeAsync: editScheme,
    isExecuting: editSchemeIsExecuting,
    result: editSchemeResult,
  } = useAction(editSchemeAction, {
    onError: () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
  })

  const {
    executeAsync: editAndroidAppLinks,
    isExecuting: editAndroidAppLinksIsExecuting,
    result: editAndroidAppLinksResult,
  } = useAction(editAndroidAppLinksAction, {
    onError: () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
  })

  const {
    executeAsync: editIosUniversalLinks,
    isExecuting: editIosUniversalLinksIsExecuting,
    result: editIosUniversalLinksResult,
  } = useAction(editIosUniversalLinksAction, {
    onError: () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
  })

  const {
    fields: iosBundleFields,
    append: appendIosBundle,
    remove: removeIosBundle,
  } = useFieldArray({
    control: form.control,
    name: 'iosBundleIds',
  })

  const {
    fields: androidFields,
    append: appendAndroid,
    remove: removeAndroid,
  } = useFieldArray({
    control: form.control,
    name: 'androidCertFingerprints',
  })

  const error =
    formatErrors(editSchemeResult) ||
    formatErrors(editAndroidAppLinksResult) ||
    formatErrors(editIosUniversalLinksResult)

  const busy =
    editSchemeIsExecuting ||
    editAndroidAppLinksIsExecuting ||
    editIosUniversalLinksIsExecuting ||
    form.formState.isSubmitting

  return (
    <Form {...form}>
      <form className='space-y-10'>
        <ErrorAlert error={error} />

        <FormField
          control={form.control}
          name='scheme'
          render={({ field, fieldState }) => (
            <SettingsField
              fieldState={fieldState}
              busy={busy}
              title='URI Scheme'
              footerLabel='Para que o deep linking funcione corretamente, a configuração de URI Scheme do seu app deve ser a mesma para Android e iOS.'
              footerButtonOnClick={form.handleSubmit(() =>
                toast.promise(
                  async () => {
                    const result = await editScheme({
                      appId: app.id,
                      scheme: field.value,
                    })

                    if (result?.serverError) {
                      throw new Error()
                    }

                    form.resetField('scheme', {
                      defaultValue: field.value,
                    })
                  },
                  {
                    loading: 'Alterando o URI Scheme...',
                    success: 'URI Scheme alterado.',
                    error: 'Erro ao alterar o URI Scheme.',
                  },
                ),
              )}
            >
              <p>
                Caso o usuário tenha o app instalado, o URI Scheme será utilizado para abrir o app
                sem direcionar para as lojas de aplicativo.
              </p>

              <Input {...field} value={field.value || ''} placeholder='ifood://' />

              <p>
                O URI Scheme é um método alternativo, utilizado em casos onde o Android App Links e
                o iOS Universal Links não estejam configurados ou não funcionem corretamente.
              </p>
            </SettingsField>
          )}
        />

        <SettingsField
          fieldState={undefined}
          busy={busy}
          title='iOS Universal Links'
          footerButtonOnClick={form.handleSubmit(() =>
            toast.promise(
              async () => {
                const result = await editIosUniversalLinks({
                  appId: app.id,
                  enableIosUniversalLinks: form.getValues('enableIosUniversalLinks'),
                  appleTeamId: form.getValues('appleTeamId'),
                  iosBundleIds: form.getValues('iosBundleIds'),
                })

                if (result?.serverError) {
                  throw new Error()
                }
              },
              {
                loading: 'Alterando a configuração do iOS Universal Links...',
                success: 'Configuração do iOS Universal Links alterada.',
                error: 'Erro ao alterar a configuração do iOS Universal Links.',
              },
            ),
          )}
        >
          <FormField
            control={form.control}
            name='enableIosUniversalLinks'
            render={({ field }) => (
              <FormItem>
                <div className='flex flex-row items-center justify-between space-y-0 rounded-lg border p-4'>
                  <FormLabel>Habilitar suporte ao iOS Universal Links</FormLabel>

                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          <p>
            iOS Universal Links oferece mais segurança e uma melhor experiência de usuário do que o
            URI Scheme, e será o método preferencial para abrir o app, caso esteja instalado no
            dispositivo do usuário.
          </p>

          <p>
            Nós fazemos toda a configuração necessária para que funcione, só precisamos do ID da
            equipe Apple do seu app, e os bundle identifiers do seu app.
          </p>

          {form.watch('enableIosUniversalLinks') && (
            <>
              <FormField
                control={form.control}
                name='appleTeamId'
                render={({ field }) => (
                  <FormItem className='mt-5'>
                    <FormLabel>ID da equipe Apple</FormLabel>

                    <FormControl>
                      <Input {...field} value={field.value || ''} placeholder='ABC123DEF4' />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='mt-2 space-y-2'>
                <FormLabel>iOS Bundle Identifiers</FormLabel>

                {iosBundleFields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`iosBundleIds.${index}.bundleId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className='flex gap-2'>
                            <Input placeholder='br.com.ifood' {...field} />

                            <Button
                              type='button'
                              variant='outline'
                              size='icon'
                              onClick={() => removeIosBundle(index)}
                              disabled={iosBundleFields.length === 1}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <Button
                type='button'
                variant='outline'
                size='sm'
                className='w-fit'
                onClick={() => appendIosBundle({ id: null, bundleId: '' })}
              >
                <Plus />
                Adicionar Bundle Identifier
              </Button>
            </>
          )}
        </SettingsField>

        <SettingsField
          fieldState={undefined}
          busy={busy}
          title='Android App Links'
          footerButtonOnClick={form.handleSubmit(() =>
            toast.promise(
              async () => {
                const result = await editAndroidAppLinks({
                  appId: app.id,
                  enableAndroidAppLinks: form.getValues('enableAndroidAppLinks'),
                  androidCertFingerprints: form.getValues('androidCertFingerprints'),
                })

                if (result?.serverError) {
                  throw new Error()
                }
              },
              {
                loading: 'Alterando a configuração do Android App Links...',
                success: 'Configuração do Android App Links alterada.',
                error: 'Erro ao alterar a configuração do Android App Links.',
              },
            ),
          )}
        >
          <FormField
            control={form.control}
            name='enableAndroidAppLinks'
            render={({ field }) => (
              <FormItem>
                <div className='flex flex-row items-center justify-between space-y-0 rounded-lg border p-4'>
                  <FormLabel>Habilitar suporte ao Android App Links</FormLabel>

                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          <p>
            Android App Links oferece mais segurança e uma melhor experiência de usuário do que o
            URI Scheme, e será o método preferencial para abrir o app, caso esteja instalado no
            dispositivo do usuário.
          </p>

          <p>
            Nós fazemos toda a configuração necessária para que funcione, só precisamos do
            certificado SHA265 do seu app.
          </p>

          {form.watch('enableAndroidAppLinks') && (
            <>
              <div className='mt-5 space-y-2'>
                <FormLabel>Android SHA256 Cert Fingerprints</FormLabel>

                {androidFields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`androidCertFingerprints.${index}.sha256Fingerprint`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className='flex flex-1 gap-2'>
                            <Input
                              placeholder='3F:2A:89:8D:37:6B:4C:AD:77:12:8B:9A:45:6E:CB:3D:9E:2F:AB:74:57:D1:67:99:BF:12:34:56:78:9A:BC:DE'
                              {...field}
                            />

                            <Button
                              type='button'
                              variant='outline'
                              size='icon'
                              onClick={() => removeAndroid(index)}
                              disabled={androidFields.length === 1}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <Button
                type='button'
                variant='outline'
                size='sm'
                className='w-fit'
                onClick={() => appendAndroid({ id: null, sha256Fingerprint: '' })}
              >
                <Plus />
                Adicionar SHA256 Fingerprint
              </Button>
            </>
          )}
        </SettingsField>
      </form>
    </Form>
  )
}
