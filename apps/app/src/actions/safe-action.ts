import { Prisma } from '@advents/db'
import { supabaseClient } from '@advents/supabase'
import { createSafeActionClient } from 'next-safe-action'

import { ActionError, UnauthorizedActionError } from '@/actions/action-errors'

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return e.code === 'P2002'
        ? `Já existe um registro com o mesmo valor único (${e.code})`
        : `Erro ao processar a requisição (Erro ${e.code})`
    }

    if (e instanceof UnauthorizedActionError) {
      return 'Usuário não autorizado.'
    }

    if (e instanceof ActionError) {
      return e.message
    }

    return 'Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte.'
  },
  defaultValidationErrorsShape: 'flattened',
})

export const authActionClient = actionClient.use(async ({ next }) => {
  const supabase = supabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new UnauthorizedActionError()
  }

  return next({
    ctx: {
      user,
      supabase,
    },
  })
})
