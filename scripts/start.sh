#!/bin/sh
set -e

DB_URL="${DATABASE_URL:-file:./dev.db}"
DB_FILE="${DB_URL#file:}"

echo "Running Prisma migrations..."
npx prisma migrate deploy

if [ ! -f "$DB_FILE" ] || [ ! -s "$DB_FILE" ]; then
  echo "Database empty, seeding initial data..."
  npx tsx prisma/seed.ts
fi

echo "Starting Next.js..."
exec node_modules/.bin/next start -p "${PORT:-3000}"
