import { Prisma, PrismaClient } from '@prisma/client'

export type PrismaJson = Prisma.InputJsonValue

export const prisma = new PrismaClient()
