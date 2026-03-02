#!/bin/bash
# Apply clapperCountFixed when you get P3005 (DB not empty, no migrate history).
# Run from anywhere:  ./scripts/apply-clapper-fixed-migration.sh  (or from root: ./apply-clapper-fixed-migration.sh if you copy it)

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# Project root: directory that contains prisma/schema.prisma (walk up from script dir)
ROOT="$SCRIPT_DIR"
while [ "$ROOT" != "/" ]; do
  [ -f "$ROOT/prisma/schema.prisma" ] && break
  ROOT="$(dirname "$ROOT")"
done
if [ ! -f "$ROOT/prisma/schema.prisma" ]; then
  echo "Could not find project root (prisma/schema.prisma). Run from project directory."
  exit 1
fi
cd "$ROOT"

MIGRATION_NAME="20250223180000_add_clapper_count_fixed"
SQL_FILE="prisma/migrations/${MIGRATION_NAME}/migration.sql"

# SQL inline so script works even if migrations folder wasn't deployed
APPLY_SQL='ALTER TABLE "SiteStats" ADD COLUMN IF NOT EXISTS "clapperCountFixed" INTEGER NOT NULL DEFAULT 64241;
UPDATE "SiteStats" SET "clapperCountFixed" = "clapperCount" WHERE "id" = '\''main'\'';'

# Load DATABASE_URL from .env if present
if [ -f .env ]; then
  export $(grep -E '^DATABASE_URL=' .env | xargs)
fi

if [ -n "$DATABASE_URL" ] && command -v psql >/dev/null 2>&1; then
  echo "Applying SQL via psql..."
  echo "$APPLY_SQL" | psql "$DATABASE_URL" -v ON_ERROR_STOP=1
  echo "Marking migration as applied..."
  npx prisma migrate resolve --applied "$MIGRATION_NAME"
  echo "Done."
else
  echo "Run the SQL below on your DB, then run the resolve command."
  echo "---"
  echo "$APPLY_SQL"
  echo "---"
  echo ""
  echo "Then (from $ROOT):  npx prisma migrate resolve --applied $MIGRATION_NAME"
fi
