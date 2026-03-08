#!/usr/bin/env bash
# =============================================================================
# Resolve failed or out-of-sync Prisma migrations so deploy can run again.
# Run ON THE SERVER from app directory (or via SSH).
#
# Usage (on server):
#   cd /var/www/wcd && export $(grep -v '^#' .env | xargs) && bash scripts/resolve-failed-migration.sh
#
# Or one-liner from local:
#   ssh root@tachka "cd /var/www/wcd && export \$(grep -v '^#' .env | xargs) && npx prisma migrate resolve --applied 20250101000000_init"
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

# P3018: tables already exist but migration not in _prisma_migrations — mark as applied
npx prisma migrate resolve --applied "20250101000000_init"

echo "Done. Run deploy again (or: npx prisma migrate deploy && npm run seed:locations && npm run seed:clappers)"
