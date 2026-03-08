#!/usr/bin/env bash
# =============================================================================
# Initial server DB setup: migrations + seed scripts. Run once when setting up
# a new server or when you need to (re)seed locations and clapper counts.
# Not run during deploy — deploy only runs scripts/setup-server-db.sh (migrations).
#
# Usage (on server): cd /var/www/wcd && export $(grep -v '^#' .env | xargs) && bash scripts/setup-server-db-with-seeds.sh
# =============================================================================

set -e
cd "$(dirname "$0")/.."

if [ -z "${DATABASE_URL}" ]; then
  if [ -f .env ]; then
    set -a
    # shellcheck disable=SC1091
    source .env
    set +a
  else
    echo "Error: DATABASE_URL not set and .env not found." >&2
    exit 1
  fi
fi

if [ -z "${DATABASE_URL}" ]; then
  echo "Error: DATABASE_URL is required in .env" >&2
  exit 1
fi

echo "Applying Prisma migrations..."
npx prisma migrate deploy

echo "Seeding locations..."
npm run seed:locations

echo "Seeding clapper counts..."
npm run seed:clappers

echo "Seeding supporters (Wall of Clappers)..."
npm run seed:supporters

echo "Server DB setup done (migrations + seeds)."
