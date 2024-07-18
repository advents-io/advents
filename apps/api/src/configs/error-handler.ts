import { Prisma } from '@prisma/client'
import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'

export const errorHandler: FastifyInstance['errorHandler'] = (
  error: FastifyError,
  _: FastifyRequest,
  reply: FastifyReply,
) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  return reply.status(500).send({
    message: 'Internal server error',
  })
}
