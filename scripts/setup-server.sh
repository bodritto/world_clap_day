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
DOMAIN="wcd.llama.energy"
APP_DIR="/var/www/$APP_NAME"

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
echo "[4/7] Creating app directory..."
mkdir -p $APP_DIR
chown -R www-data:www-data /var/www

# Install certbot if not present
if ! command -v certbot &> /dev/null; then
    echo "[5/7] Installing Certbot..."
    apt-get install -y certbot python3-certbot-nginx
else
    echo "[5/7] Certbot already installed"
fi

# Create nginx configuration
echo "[6/7] Creating Nginx configuration..."
cat > /etc/nginx/sites-available/$DOMAIN << 'NGINX_CONF'
server {
    listen 80;
    server_name wcd.llama.energy;

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

# Enable the site
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

# Test and reload nginx
nginx -t
systemctl reload nginx

# Setup PM2 startup
echo "[7/7] Configuring PM2 startup..."
pm2 startup systemd -u root --hp /root
pm2 save

echo ""
echo "=========================================="
echo "  Server setup complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Run the deploy script from your local machine"
echo "2. Create .env file at $APP_DIR/.env with your secrets"
echo "3. After first deploy, run: certbot --nginx -d $DOMAIN"
echo ""
echo "App directory: $APP_DIR"
echo "App port: $APP_PORT"
echo "Domain: $DOMAIN"
echo ""
