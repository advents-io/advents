import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'

import { BadRequestError, NotFoundError } from '@/http/errors'
import { badRequest, internalServerError, notFound } from '@/http/responses'

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

    if (error instanceof NotFoundError) {
      return notFound({ error: error.message })
    }

    if (error instanceof BadRequestError) {
      return badRequest({ error: error.message })
    }

    return internalServerError({
      error: 'Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte.',
    })
  }
}
