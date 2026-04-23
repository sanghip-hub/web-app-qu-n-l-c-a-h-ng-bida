import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

function getDbUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  return `file:${path.join(process.cwd(), "dev.db")}`;
}

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({ url: getDbUrl() });
  return new PrismaClient({ adapter });
}

declare global {
  var prismaGlobal: ReturnType<typeof createPrismaClient> | undefined;
}

export const prisma = globalThis.prismaGlobal ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
