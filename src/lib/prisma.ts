import { PrismaClient } from '@prisma/client'

import { IS_DEVELOPMENT } from '@/utils/env'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (IS_DEVELOPMENT) {
  globalThis.prismaGlobal = prisma
}
