#!/usr/bin/env bash
# =============================================================================
# One-time recovery when .db-password is missing on the server and DB auth fails.
# Resets PostgreSQL user "wcd" password, creates .db-password, updates .env.
# Run ON THE SERVER (as root):  cd /var/www/wcd && bash scripts/reset-server-db-password.sh
# Or from local:  ssh root@YOUR_SERVER 'cd /var/www/wcd && bash -s' < scripts/reset-server-db-password.sh
# =============================================================================

set -e
APP_DIR="${APP_DIR:-/var/www/wcd}"
DB_USER="${DB_USER:-wcd}"
DB_NAME="${DB_NAME:-wcd}"

cd "$APP_DIR" 2>/dev/null || { echo "Error: $APP_DIR not found. Run on the server." >&2; exit 1; }

if [ -f .db-password ]; then
    echo ".db-password already exists. Use scripts/fix-server-env.sh to sync .env if needed."
    exit 0
fi

echo "Resetting PostgreSQL password for user $DB_USER and creating .db-password..."
NEW_PASS=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 32)
NEW_PASS_ESC=$(echo "$NEW_PASS" | sed "s/'/''/g")
if ! sudo -u postgres psql -c "ALTER USER $DB_USER WITH PASSWORD '$NEW_PASS_ESC';"; then
    echo "Error: Could not alter user (user may not exist). Run full setup: ssh root@SERVER 'bash -s' < scripts/setup-server.sh" >&2
    exit 1
fi
echo -n "$NEW_PASS" > .db-password
chmod 600 .db-password

# Update .env with new DATABASE_URL
DATABASE_URL="postgresql://${DB_USER}:${NEW_PASS}@localhost:5432/${DB_NAME}"
if [ -f .env ]; then
    if grep -q '^DATABASE_URL=' .env; then
        grep -v '^DATABASE_URL=' .env > .env.tmp
        echo "DATABASE_URL=\"$DATABASE_URL\"" >> .env.tmp
        mv .env.tmp .env
    else
        echo "DATABASE_URL=\"$DATABASE_URL\"" >> .env
    fi
else
    echo "DATABASE_URL=\"$DATABASE_URL\"" > .env
    chmod 600 .env
fi
echo "Done. .db-password created and .env updated. Run deploy again or: pm2 restart wcd"