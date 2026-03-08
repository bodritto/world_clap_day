#!/usr/bin/env bash
# =============================================================================
# Quick check: app, nginx, ports. Run ON THE SERVER: bash scripts/check-server.sh
# =============================================================================
set -e
APP_PORT="${APP_PORT:-3006}"
DOMAIN="${DOMAIN:-wcd.sleephackers.club}"

echo "=== 1. App (localhost:$APP_PORT) ==="
if curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$APP_PORT" 2>/dev/null | grep -q '200\|301\|302'; then
    echo "OK  App responds on http://127.0.0.1:$APP_PORT"
else
    echo "FAIL App not responding. Check: pm2 logs wcd"
fi

echo ""
echo "=== 2. Nginx ==="
if command -v nginx &>/dev/null; then
    if systemctl is-active --quiet nginx 2>/dev/null; then
        echo "OK  Nginx is running"
    else
        echo "FAIL Nginx not running. Run: sudo systemctl start nginx"
    fi
    if [ -f "/etc/nginx/sites-enabled/$DOMAIN" ] || grep -rq "server_name.*$DOMAIN" /etc/nginx/sites-enabled/ 2>/dev/null; then
        echo "OK  Site config present for $DOMAIN"
    else
        echo "FAIL No nginx config for $DOMAIN. Run setup-server.sh to create it."
    fi
else
    echo "FAIL Nginx not installed. Run setup-server.sh"
fi

echo ""
echo "=== 3. Port 80 (from outside) ==="
if command -v ss &>/dev/null && ss -tlnp 2>/dev/null | grep -q ':80 '; then
    echo "OK  Something is listening on port 80"
else
    echo "FAIL Nothing listening on 80. Start nginx or check firewall."
fi

echo ""
echo "=== 4. PM2 ==="
if command -v pm2 &>/dev/null; then
    pm2 list 2>/dev/null | head -10 || true
fi
echo ""
echo "Open in browser: http://$(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_SERVER_IP') or https://$DOMAIN (after certbot)"