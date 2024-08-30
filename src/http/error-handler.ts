import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'

import { BadRequestError } from '@/http/errors/bad-request-error'
import { NotFoundError } from '@/http/errors/not-found-error'
import { badRequest } from '@/http/responses/bad-request'
import { internalServerError } from '@/http/responses/internal-server-error'
import { notFound } from '@/http/responses/not-found'

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
