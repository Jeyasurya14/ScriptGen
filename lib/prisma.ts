import { Prisma, PrismaClient } from "@prisma/client";

const prismaLogLevels: Prisma.LogLevel[] =
  process.env.NODE_ENV === "development"
    ? ["query", "warn", "error"]
    : ["error"];

function isRetryableConnectionError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === "P1017";
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true;
  }

  const message = error instanceof Error ? error.message.toLowerCase() : "";
  return [
    "server has closed the connection",
    "connection terminated unexpectedly",
    "terminating connection",
    "connection reset",
    "broken pipe",
  ].some((pattern) => message.includes(pattern));
}

function createPrismaClient() {
  const client = new PrismaClient({
    log: prismaLogLevels,
  });

  return client.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          try {
            return await query(args);
          } catch (error) {
            if (!isRetryableConnectionError(error)) {
              throw error;
            }

            console.warn(`[prisma] retrying ${model}.${operation} after reconnect`);

            await client.$disconnect().catch(() => undefined);
            await client.$connect();

            return query(args);
          }
        },
      },
    },
  });
}

type PrismaClientSingleton = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClientSingleton;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

