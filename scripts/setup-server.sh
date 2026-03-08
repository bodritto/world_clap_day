#!/bin/bash

# =============================================================================
# WCD Server Setup Script
# Run this ONCE on your Digital Ocean server to set up the environment
# Usage: ssh root@YOUR_SERVER_IP 'bash -s' < scripts/setup-server.sh
# =============================================================================

set -e

# Configuration
APP_NAME="wcd"
APP_PORT="3006"
DOMAIN="wcd.sleephackers.club"
APP_DIR="/var/www/$APP_NAME"
DB_NAME="wcd"
DB_USER="wcd"

# Must run on the server (as root or with write access to /var/www)
if ! mkdir -p "$APP_DIR" 2>/dev/null; then
    echo "This script is for the server, not your local machine."
    echo "Run it ON THE SERVER via SSH, for example:"
    echo "  ssh root@YOUR_SERVER_IP 'bash -s' < scripts/setup-server.sh"
    echo "Or from the server: curl -s ... | bash"
    exit 1
fi

# Optional: copy production .env from this path (e.g. after: scp .env.production root@server:/tmp/.env.production)
# Usage: ENV_FILE=/tmp/.env.production bash -s < scripts/setup-server.sh
if [ -n "${ENV_FILE}" ] && [ -f "${ENV_FILE}" ]; then
    echo "Copying env from ${ENV_FILE} to ${APP_DIR}/.env"
    mkdir -p "$APP_DIR"
    cp "${ENV_FILE}" "$APP_DIR/.env"
    chmod 600 "$APP_DIR/.env"
    echo "  → $APP_DIR/.env created from your file (DATABASE_URL below may be overwritten if we create DB)"
fi

echo "=========================================="
echo "  Setting up $DOMAIN"
echo "=========================================="

# Update system
echo "[1/7] Updating system packages..."
# apt-get update -qq
# apt-get upgrade -y -qq

# Install Node.js 20.x if not present
if ! command -v node &> /dev/null; then
    echo "[2/7] Installing Node.js 20.x..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    echo "[2/7] Node.js already installed: $(node -v)"
fi

# Install PM2 globally if not present
if ! command -v pm2 &> /dev/null; then
    echo "[3/7] Installing PM2..."
    npm install -g pm2
else
    echo "[3/7] PM2 already installed"
fi

# Create app directory
echo "[4/8] Creating app directory..."
mkdir -p $APP_DIR
chown -R www-data:www-data /var/www

# Install and configure PostgreSQL (local instance for the app)
echo "[5/8] Installing and configuring PostgreSQL..."
if ! command -v psql &> /dev/null; then
    apt-get install -y postgresql postgresql-contrib
    systemctl enable postgresql
    systemctl start postgresql
fi
# Ensure PostgreSQL listens only on localhost (no external access)
PG_CONF=$(sudo -u postgres psql -t -A -c "SHOW config_file;" 2>/dev/null || echo "")
if [ -z "$PG_CONF" ] && [ -d /etc/postgresql ]; then
    PG_CONF=$(find /etc/postgresql -name postgresql.conf -type f 2>/dev/null | head -1)
fi
if [ -n "$PG_CONF" ] && [ -f "$PG_CONF" ]; then
    # Force listen only on localhost (never 0.0.0.0 or *)
    if grep -qE "^listen_addresses\s*=" "$PG_CONF"; then
        sed -i "s/^listen_addresses\s*=.*/listen_addresses = 'localhost'/" "$PG_CONF"
    elif grep -qE "#listen_addresses" "$PG_CONF"; then
        sed -i "s/#listen_addresses\s*=.*/listen_addresses = 'localhost'/" "$PG_CONF"
    else
        echo "listen_addresses = 'localhost'" >> "$PG_CONF"
    fi
    systemctl restart postgresql 2>/dev/null || systemctl restart postgresql@* 2>/dev/null || true
    echo "  → PostgreSQL bound to localhost only (no external access)"
fi
# Create DB user and database if they don't exist
DB_PASS_FILE="$APP_DIR/.db-password"
if [ ! -f "$DB_PASS_FILE" ]; then
    DB_PASS=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 32)
    echo -n "$DB_PASS" > "$DB_PASS_FILE"
    chmod 600 "$DB_PASS_FILE"
    # Escape single quotes for use in psql
    DB_PASS_ESC=$(echo "$DB_PASS" | sed "s/'/''/g")
    sudo -u postgres psql -t -A -c "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 || \
        sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS_ESC';"
    sudo -u postgres psql -t -A -c "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1 || \
        sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
    sudo -u postgres psql -d "$DB_NAME" -c "GRANT ALL ON SCHEMA public TO $DB_USER;"
    # Set DATABASE_URL in .env (create file only if missing, so we don't overwrite existing secrets)
    DB_URL="postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME"
    if [ ! -f "$APP_DIR/.env" ]; then
        echo "DATABASE_URL=\"$DB_URL\"" > "$APP_DIR/.env"
        chmod 600 "$APP_DIR/.env"
    elif ! grep -q '^DATABASE_URL=' "$APP_DIR/.env"; then
        echo "DATABASE_URL=\"$DB_URL\"" >> "$APP_DIR/.env"
    fi
    echo "  → Database '$DB_NAME' and user '$DB_USER' created. Password saved to $APP_DIR/.db-password"
else
    echo "  → PostgreSQL already configured (password in $DB_PASS_FILE)"
    # Ensure .env has DATABASE_URL if it was created earlier
    if ! grep -q '^DATABASE_URL=' "$APP_DIR/.env" 2>/dev/null; then
        DB_PASS=$(cat "$DB_PASS_FILE")
        echo "DATABASE_URL=\"postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME\"" >> "$APP_DIR/.env"
    fi
fi

# Install certbot if not present
if ! command -v certbot &> /dev/null; then
    echo "[6/8] Installing Certbot..."
    apt-get install -y certbot python3-certbot-nginx
else
    echo "[6/8] Certbot already installed"
fi

# Create nginx configuration
echo "[7/8] Creating Nginx configuration..."
cat > /etc/nginx/sites-available/$DOMAIN << 'NGINX_CONF'
server {
    listen 80;
    server_name __DOMAIN__;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:3006;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }

    # Cache static assets
    location /_next/static {
        proxy_pass http://localhost:3006;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, immutable, max-age=31536000";
    }

    # Health check endpoint
    location /health {
        access_log off;
        proxy_pass http://localhost:3006;
    }
}
NGINX_CONF
sed -i "s/__DOMAIN__/$DOMAIN/g" /etc/nginx/sites-available/$DOMAIN

# Enable the site
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

# Test and reload nginx
nginx -t
systemctl reload nginx

# Setup PM2 startup
echo "[8/8] Configuring PM2 startup..."
pm2 startup systemd -u root --hp /root
pm2 save

echo ""
echo "=========================================="
echo "  Server setup complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. (Optional) To use your production .env: copy it to the server and run with ENV_FILE:"
echo "   scp .env.production $USER@this-server:/tmp/ && ssh ... 'ENV_FILE=/tmp/.env.production bash -s' < scripts/setup-server.sh"
echo "   Or on first deploy use: ./scripts/deploy.sh --with-env (requires .env.production in project root)"
echo "2. Add any extra secrets to $APP_DIR/.env if needed (DATABASE_URL is set for local Postgres unless you used ENV_FILE)"
echo "3. Deploy from your machine: ./scripts/deploy.sh (or ./scripts/deploy.sh --with-env to push .env.production)"
echo "4. Enable HTTPS (once): ssh root@THIS_SERVER 'certbot --nginx -d $DOMAIN'  # or: bash scripts/enable-https.sh"
echo ""
echo "App directory: $APP_DIR"
echo "App port: $APP_PORT"
echo "Domain: $DOMAIN"
echo "Database: PostgreSQL on THIS server, localhost (user $DB_USER, database $DB_NAME, password in $APP_DIR/.db-password)"
echo "  → DATABASE_URL in $APP_DIR/.env is set for this. Deploy with --with-env keeps this URL; only other vars come from .env.production."
if command -v ss &>/dev/null && ss -tlnp 2>/dev/null | grep -q 5432; then
    echo ""
    echo "PostgreSQL listen check (must be 127.0.0.1 only):"
    ss -tlnp 2>/dev/null | grep 5432 || true
fi
echo ""
