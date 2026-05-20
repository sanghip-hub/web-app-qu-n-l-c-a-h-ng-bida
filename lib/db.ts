import { PrismaClient } from "@/app/generated/prisma/client";

function createPrismaClient() {
  return new PrismaClient();
}

declare global {
  var prismaGlobal: ReturnType<typeof createPrismaClient> | undefined;
}

export const prisma = globalThis.prismaGlobal ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
