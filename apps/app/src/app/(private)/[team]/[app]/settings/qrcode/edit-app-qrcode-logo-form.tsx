'use client'

import {
  editAppQrcodeLogoAction,
  EditAppQrcodeLogoFormInput,
  editAppQrcodeLogoFormInputSchema,
  formatErrors,
  useAction,
} from '@advents/mutations'
import { zodResolver } from '@hookform/resolvers/zod'
import { CloudUploadIcon } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ErrorAlert } from '@/components/error-alert'
import { SettingsField } from '@/components/settings-field'
import { image } from '@/lib/image'
import { Form, FormField } from '@/ui/form'

interface Props {
  qrcodeLogoUrl: string | null
}

export const EditAppQrcodeLogoForm = ({ qrcodeLogoUrl }: Props) => {
  const { app: appSlug } = useParams<{ app: string }>()

  const {
    executeAsync: editAppQrcodeLogo,
    isExecuting,
    result,
  } = useAction(editAppQrcodeLogoAction)

  const form = useForm<EditAppQrcodeLogoFormInput>({
    resolver: zodResolver(editAppQrcodeLogoFormInputSchema),
  })

  const busy = isExecuting || form.formState.isSubmitting

  const error = formatErrors(result)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      return
    }

    const result = editAppQrcodeLogoFormInputSchema.safeParse({
      qrcodeLogoFile: file,
    })

    if (!result.success) {
      const message =
        result.error?.flatten().fieldErrors.qrcodeLogoFile?.[0] ??
        'Erro ao alterar a logo do QR Code.'

      toast.error(message)
      return
    }

    const compressedFile = await image.compress(file, {
      quality: 0.8,
      width: 512,
      height: 512,
      resize: 'cover',
    })

    form.setValue('qrcodeLogoFile', compressedFile, { shouldDirty: true })
    form.trigger('qrcodeLogoFile')
  }

  return (
    <div className='space-y-10'>
      <ErrorAlert error={error} />

      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name='qrcodeLogoFile'
            render={({ field: { value: qrcodeLogoFile }, fieldState }) => (
              <SettingsField
                fieldState={fieldState}
                busy={busy}
                title='Logo do QR Code'
                footerLabel='Recomendado imagem quadrada. Tipo de imagem aceito: .png, .jpg, .jpeg. Tamanho máximo do arquivo: 2MB.'
                footerButtonOnClick={form.handleSubmit(() =>
                  toast.promise(
                    async () => {
                      const result = await editAppQrcodeLogo({
                        appSlug,
                        qrcodeLogoFile,
                      })

                      if (result?.serverError) {
                        throw new Error()
                      }

                      form.resetField('qrcodeLogoFile', {
                        defaultValue: qrcodeLogoFile,
                      })
                    },
                    {
                      loading: 'Alterando a logo do QR Code...',
                      success: 'Logo do QR Code alterada.',
                      error: 'Erro ao alterar a logo do QR Code.',
                    },
                  ),
                )}
              >
                <p>Imagem que será utilizada para inserir no centro do QR Code de um link.</p>

                <label
                  htmlFor='qrcode-logo'
                  className='flex size-20 items-center justify-center overflow-hidden rounded-md bg-gray-100 outline-1 outline-gray-300 hover:cursor-pointer hover:bg-white hover:outline [&>img]:block [&>img]:hover:hidden'
                >
                  {(qrcodeLogoUrl || qrcodeLogoFile) && (
                    <Image
                      src={qrcodeLogoFile ? URL.createObjectURL(qrcodeLogoFile) : qrcodeLogoUrl!}
                      alt='Logo do QR Code'
                      width={80}
                      height={80}
                      priority
                    />
                  )}
                  <CloudUploadIcon className='size-5 text-muted-foreground' />

                  <input
                    id='qrcode-logo'
                    type='file'
                    className='hidden'
                    accept='.png,.jpg,.jpeg'
                    onChange={handleFileChange}
                  />
                </label>
              </SettingsField>
            )}
          />
        </form>
      </Form>
    </div>
  )
}
