import { Prisma } from '@prisma/client'
import { HTTPError } from 'ky'
import { NextResponse } from 'next/server'

import { badRequest, internalServerError } from '@/http/responses'

export interface ErrorResponse {
  error: string
}

export const getErrorMessage = async (error: unknown) => {
  if (error instanceof HTTPError) {
    return (await error.response.json<ErrorResponse>()).error
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Erro desconhecido'
}

export async function errorHandler<T>(
  handler: () => Promise<NextResponse<T>>,
): Promise<NextResponse<T> | NextResponse<ErrorResponse>> {
  try {
    return await handler()
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return badRequest({
          error: `Já existe um registro com o mesmo valor único (${error.code})`,
        })
      }

      return badRequest({ error: `Erro ao processar a requisição (Erro ${error.code})` })
    }

    return internalServerError({
      error: 'Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte.',
    })
  }
}
