#!/usr/bin/env bash
# =============================================================================
# Reset database from scratch and seed all tables.
# Drops all data, reapplies migrations, then runs: locations, clapper counts,
# supporters (Wall of Clappers).
#
# Usage:
#   cd /path/to/wcd && export $(grep -v '^#' .env | xargs) && bash scripts/reset-db-and-seed.sh
#   bash scripts/reset-db-and-seed.sh --no-confirm   # skip confirmation (e.g. CI)
# =============================================================================

set -e
cd "$(dirname "$0")/.."

if [ -z "${DATABASE_URL}" ]; then
  if [ -f .env ]; then
    set -a
    # shellcheck disable=SC1091
    source .env
    set +a
  elif [ -f .env.local ]; then
    set -a
    # shellcheck disable=SC1091
    source .env.local
    set +a
  else
    echo "Error: DATABASE_URL not set and .env / .env.local not found." >&2
    exit 1
  fi
fi

if [ -z "${DATABASE_URL}" ]; then
  echo "Error: DATABASE_URL is required." >&2
  exit 1
fi

if [ "$1" != "--no-confirm" ]; then
  echo "This will DROP all data in the database and reseed. DATABASE_URL will be used."
  echo "Continue? [y/N]"
  read -r ans
  if [ "$ans" != "y" ] && [ "$ans" != "Y" ]; then
    echo "Aborted."
    exit 0
  fi
fi

echo "Resetting database (drop schema + re-apply migrations)..."
npx prisma migrate reset --force

echo "Seeding locations..."
npm run seed:locations

echo "Seeding clapper counts..."
npm run seed:clappers

echo "Seeding supporters (Wall of Clappers)..."
npm run seed:supporters

echo "Done. Database reset and all seeds applied."
