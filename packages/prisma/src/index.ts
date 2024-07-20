import { Prisma, PrismaClient } from '@prisma/client'

export { Prisma }

export type PrismaJson = Prisma.InputJsonValue

export const prisma = new PrismaClient()
