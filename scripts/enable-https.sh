#!/usr/bin/env bash
# =============================================================================
# Enable HTTPS for the site (run once after first deploy).
# Run ON THE SERVER:  sudo certbot --nginx -d wcd.sleephackers.club
# Or from local:      ssh root@tachka 'certbot --nginx -d wcd.sleephackers.club'
# Certbot will edit nginx config and set up SSL. Port 443 must be open in firewall.
# =============================================================================
DOMAIN="${1:-wcd.sleephackers.club}"
if ! command -v certbot &>/dev/null; then
    echo "Certbot not installed. Run setup-server.sh first, or: sudo apt-get install certbot python3-certbot-nginx"
    exit 1
fi
echo "Running: certbot --nginx -d $DOMAIN"
exec sudo certbot --nginx -d "$DOMAIN"
