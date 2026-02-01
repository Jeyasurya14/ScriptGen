import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const prismaClientSingleton = () => {
    return new PrismaClient({
        log: ['query'],
    })
}

export const prisma =
    globalForPrisma.prisma || prismaClientSingleton()

