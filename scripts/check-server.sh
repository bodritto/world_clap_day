#!/bin/bash
# Run on the SERVER to debug 502 / app not responding.
# Usage: ssh root@tachka 'bash -s' < scripts/check-server.sh

set -e
APP_NAME="wcd"
APP_PORT="3006"
REMOTE_DIR="/var/www/$APP_NAME"

echo "=== PM2 status ==="
pm2 list
echo ""
echo "=== Listening on port $APP_PORT (expect 0.0.0.0 or 127.0.0.1) ==="
ss -tlnp 2>/dev/null | grep -E ":$APP_PORT |LISTEN" || true
echo ""
echo "=== Local HTTP check (expect 200) ==="
curl -s -o /dev/null -w "HTTP %{http_code}\n" "http://127.0.0.1:$APP_PORT/" || true
echo ""
echo "=== Last 30 lines of app log ==="
pm2 logs "$APP_NAME" --lines 30 --nostream 2>/dev/null || true
