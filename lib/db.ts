import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaNeonHTTP } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";

function createPrismaClient() {
  const sql = neon(process.env.DATABASE_URL!);
  const adapter = new PrismaNeonHTTP(sql);
  return new PrismaClient({ adapter });
}

declare global {
  var prismaGlobal: ReturnType<typeof createPrismaClient> | undefined;
}

export const prisma = globalThis.prismaGlobal ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
