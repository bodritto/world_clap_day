#!/bin/bash

# =============================================================================
# WCD Sanity Studio Server Setup Script
# Run this ONCE on your server to set up Sanity Studio
# Usage: ssh root@YOUR_SERVER_IP 'bash -s' < scripts/setup-studio.sh
# =============================================================================

set -e

# Configuration
STUDIO_NAME="wcd-studio"
STUDIO_PORT="3007"
STUDIO_DOMAIN="studio.wcd.llama.energy"
STUDIO_DIR="/var/www/$STUDIO_NAME"

echo "=========================================="
echo "  Setting up Sanity Studio at $STUDIO_DOMAIN"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed. Run setup-server.sh first."
    exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "[ERROR] PM2 is not installed. Run setup-server.sh first."
    exit 1
fi

# Create studio directory
echo "[1/5] Creating studio directory..."
mkdir -p $STUDIO_DIR
chown -R www-data:www-data /var/www

# Create nginx configuration for studio
echo "[2/5] Creating Nginx configuration..."
cat > /etc/nginx/sites-available/$STUDIO_DOMAIN << 'NGINX_CONF'
server {
    listen 80;
    server_name studio.wcd.llama.energy;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Serve static files from the built studio
    root /var/www/wcd-studio/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_CONF

# Enable the site
echo "[3/5] Enabling site..."
ln -sf /etc/nginx/sites-available/$STUDIO_DOMAIN /etc/nginx/sites-enabled/

# Test and reload nginx
echo "[4/5] Testing and reloading Nginx..."
nginx -t
systemctl reload nginx

echo "[5/5] Setup complete!"

echo ""
echo "=========================================="
echo "  Sanity Studio server setup complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Deploy the studio from your local machine:"
echo "   cd studio && npm install && npm run build"
echo "   scp -r dist/* root@YOUR_SERVER:/var/www/wcd-studio/dist/"
echo ""
echo "2. Or use the deploy script:"
echo "   ./scripts/deploy-studio.sh YOUR_SERVER_IP"
echo ""
echo "3. Set up SSL certificate:"
echo "   certbot --nginx -d $STUDIO_DOMAIN"
echo ""
echo "Studio directory: $STUDIO_DIR"
echo "Studio domain: $STUDIO_DOMAIN"
echo ""
