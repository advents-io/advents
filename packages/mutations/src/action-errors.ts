export class ActionError extends Error {}

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
