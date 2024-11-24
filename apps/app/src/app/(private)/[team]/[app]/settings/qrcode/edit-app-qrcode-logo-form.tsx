'use client'

import {
  deleteAppQrCodeLogoAction,
  editAppQrCodeLogoAction,
  EditAppQrCodeLogoFormInput,
  editAppQrCodeLogoFormInputSchema,
  formatErrors,
  useAction,
} from '@advents/mutations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { CloudUploadIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ErrorAlert } from '@/components/error-alert'
import { SettingsField } from '@/components/settings-field'
import { image } from '@/lib/image'
import { getAppQrCodeLogoUrl } from '@/lib/queries/get-app-qrcode-logo-url'
import { Button } from '@/ui/button'
import { Form, FormField } from '@/ui/form'

export const EditAppQrCodeLogoForm = () => {
  const { app: appSlug, team: teamSlug } = useParams<{ app: string; team: string }>()

  const { data, refetch: refetchAppQrCodeLogoUrl } = useQuery({
    queryKey: ['app-qr-code-logo-url', appSlug, teamSlug],
    queryFn: () => getAppQrCodeLogoUrl({ appSlug, teamSlug }),
  })

  const qrCodeLogoUrl = data?.url ?? null

  const {
    executeAsync: editAppQrCodeLogo,
    isExecuting: isEditing,
    result: editResult,
  } = useAction(editAppQrCodeLogoAction)

  const {
    executeAsync: deleteAppQrCodeLogo,
    isExecuting: isDeleting,
    result: deleteResult,
  } = useAction(deleteAppQrCodeLogoAction)

  const handleEditAppQrCodeLogo = () =>
    form.handleSubmit(() =>
      toast.promise(
        async () => {
          const result = await editAppQrCodeLogo({
            appSlug,
            qrCodeLogoFile: form.getValues('qrCodeLogoFile'),
          })

          if (result?.serverError) {
            throw new Error()
          }

          await refetchAppQrCodeLogoUrl()
          form.reset()
        },
        {
          loading: 'Alterando a logo do QR Code...',
          success: 'Logo do QR Code alterada.',
          error: 'Erro ao alterar a logo do QR Code.',
        },
      ),
    )()

  const handleDeleteAppQrCodeLogo = () =>
    toast.promise(
      async () => {
        const result = await deleteAppQrCodeLogo({ appSlug })

        if (result?.serverError) {
          throw new Error()
        }

        await refetchAppQrCodeLogoUrl()
        form.reset()
      },
      {
        loading: 'Removendo a logo do QR Code...',
        success: 'Logo do QR Code removida.',
        error: 'Erro ao remover a logo do QR Code.',
      },
    )

  const form = useForm<EditAppQrCodeLogoFormInput>({
    resolver: zodResolver(editAppQrCodeLogoFormInputSchema),
  })

  const busy = isEditing || isDeleting || form.formState.isSubmitting

  const error = formatErrors(editResult) || formatErrors(deleteResult)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      return
    }

    const result = editAppQrCodeLogoFormInputSchema.safeParse({
      qrCodeLogoFile: file,
    })

    if (!result.success) {
      const message =
        result.error?.flatten().fieldErrors.qrCodeLogoFile?.[0] ??
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

    form.setValue('qrCodeLogoFile', compressedFile, { shouldDirty: true })
    form.trigger('qrCodeLogoFile')
  }

  return (
    <div className='space-y-10'>
      <ErrorAlert error={error} />

      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name='qrCodeLogoFile'
            render={({ field: { value: qrCodeLogoFile }, fieldState }) => (
              <SettingsField
                fieldState={fieldState}
                busy={busy}
                title='Logo do QR Code'
                footerLabel='Recomendado imagem quadrada. Tipo de imagem aceito: .png, .jpg, .jpeg. Tamanho máximo do arquivo: 2MB.'
                footerButtonOnClick={handleEditAppQrCodeLogo}
              >
                <p>Imagem que será utilizada para inserir no centro do QR Code de um link.</p>

                <label
                  htmlFor='qrcode-logo'
                  className='relative flex size-20 items-center justify-center rounded-md bg-gray-100 outline-1 outline-gray-300 hover:cursor-pointer hover:outline'
                >
                  {(qrCodeLogoUrl || qrCodeLogoFile) && (
                    <Image
                      src={qrCodeLogoFile ? URL.createObjectURL(qrCodeLogoFile) : qrCodeLogoUrl!}
                      alt='Logo do QR Code'
                      width={80}
                      height={80}
                      priority
                      className='rounded-md'
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

                  {qrCodeLogoUrl && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='absolute -right-2 -top-2 size-6 rounded-full border border-gray-200 bg-gray-50 hover:border-gray-400 hover:bg-gray-200'
                      onClick={handleDeleteAppQrCodeLogo}
                    >
                      <XIcon />
                    </Button>
                  )}
                </label>
              </SettingsField>
            )}
          />
        </form>
      </Form>
    </div>
  )
}
