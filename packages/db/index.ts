import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export * from '@prisma/client'

if (process.env.NODE_ENV === 'development') {
  globalThis.prismaGlobal = prisma
}
