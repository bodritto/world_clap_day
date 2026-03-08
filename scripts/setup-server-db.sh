#!/usr/bin/env bash
# =============================================================================
# Server DB: apply Prisma migrations only. Used by deploy.sh (step 4).
# For initial server setup including seeds, run: scripts/setup-server-db-with-seeds.sh
# Usage (on server): cd /var/www/wcd && export $(grep -v '^#' .env | xargs) && bash scripts/setup-server-db.sh
# =============================================================================

set -e
cd "$(dirname "$0")/.."

# Load .env if not already set (e.g. when run standalone on server)
if [ -z "${DATABASE_URL}" ]; then
  if [ -f .env ]; then
    set -a
    # shellcheck disable=SC1091
    source .env
    set +a
  else
    echo "Error: DATABASE_URL not set and .env not found. Run from app dir with .env or export DATABASE_URL." >&2
    exit 1
  fi
fi

if [ -z "${DATABASE_URL}" ]; then
  echo "Error: DATABASE_URL is required in .env" >&2
  exit 1
fi

# Show which DB we're using (host only, no credentials)
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's|.*@\([^/]*\)/.*|\1|p' || true)
echo "Using database at: ${DB_HOST:-unknown}"

echo "Applying Prisma migrations..."
npx prisma migrate deploy

echo "Server DB migrations done."
