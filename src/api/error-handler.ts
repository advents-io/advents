import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'

import { badRequest, internalServerError } from '@/api/responses'

export interface ErrorResponse {
  error: string
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
