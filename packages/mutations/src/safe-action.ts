import { supabaseServer } from '@advents/supabase'
import { Prisma } from '@prisma/client'
import { createSafeActionClient } from 'next-safe-action'

import { ActionError } from './action-errors'

export const actionClient = createSafeActionClient({
  handleServerError(e) {
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

export const authActionClient = actionClient.use(async ({ next }) => {
  const supabase = await supabaseServer()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return next({
    ctx: {
      user: session!.user,
      supabase,
    },
  })
})
