#!/usr/bin/env bash
# =============================================================================
# Fix .env on the server after it was overwritten (e.g. by deploy --with-env).
# Restores DATABASE_URL from .db-password (set by setup-server.sh).
# Run ON THE SERVER:  bash scripts/fix-server-env.sh
# Or from local:      ssh root@YOUR_SERVER 'bash -s' < scripts/fix-server-env.sh
# =============================================================================

set -e
APP_DIR="${APP_DIR:-/var/www/wcd}"
DB_USER="${DB_USER:-wcd}"
DB_NAME="${DB_NAME:-wcd}"

cd "$APP_DIR" 2>/dev/null || { echo "Error: $APP_DIR not found. Run on the server from app root or set APP_DIR." >&2; exit 1; }

if [ ! -f .db-password ]; then
    echo "Error: $APP_DIR/.db-password not found." >&2
    echo "If you never ran setup-server.sh, run it first: ssh root@SERVER 'bash -s' < scripts/setup-server.sh" >&2
    echo "If the server was fully reset, run setup-server.sh again to create DB and .db-password." >&2
    exit 1
fi

DB_PASS=$(cat .db-password)
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}"

if [ ! -f .env ]; then
    echo "DATABASE_URL=\"$DATABASE_URL\"" > .env
    chmod 600 .env
    echo "Created .env with DATABASE_URL from .db-password"
else
    if grep -q '^DATABASE_URL=' .env; then
        grep -v '^DATABASE_URL=' .env > .env.tmp
        echo "DATABASE_URL=\"$DATABASE_URL\"" >> .env.tmp
        mv .env.tmp .env
        echo "Updated DATABASE_URL in .env from .db-password"
    else
        echo "DATABASE_URL=\"$DATABASE_URL\"" >> .env
        echo "Appended DATABASE_URL to .env from .db-password"
    fi
fi

echo "Done. Restart the app if needed: pm2 restart wcd"
