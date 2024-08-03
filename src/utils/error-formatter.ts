import { HTTPError } from 'ky'

import { ErrorResponse } from '@/api/error-handler'

export const getErrorMessage = async (error: unknown) => {
  if (error instanceof HTTPError) {
    return (await error.response.json<ErrorResponse>()).error
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Erro desconhecido'
}
