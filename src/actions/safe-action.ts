import { Prisma } from '@prisma/client'
import { createSafeActionClient } from 'next-safe-action'

export class ActionError extends Error {}

export const actionClient = createSafeActionClient({
  handleReturnedServerError(e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return e.code === 'P2002'
        ? `Já existe um registro com o mesmo valor único (${e.code})`
        : `Erro ao processar a requisição (Erro ${e.code})`
    }

    if (e instanceof ActionError) {
      return e.message
    }

    return 'Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte.'
  },
  defaultValidationErrorsShape: 'flattened',
})

export const formatErrors = (result: {
  serverError?: string
  validationErrors?: {
    formErrors: string[]
    fieldErrors: Record<string, string[]>
  }
}): string | undefined => {
  const { serverError, validationErrors } = result
  const errors: string[] = []

  if (serverError) {
    errors.push(serverError)
  }

  if (validationErrors?.fieldErrors) {
    Object.values(validationErrors.fieldErrors)
      .flat()
      .forEach(error => {
        errors.push(error)
      })
  }

  if (validationErrors?.formErrors) {
    errors.push(...validationErrors.formErrors)
  }

  return errors.length > 0 ? errors.join('\n') : undefined
}
