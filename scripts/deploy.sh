#!/bin/bash

# =============================================================================
# WCD Deployment Script
# Run this from your LOCAL machine to deploy updates to the server
# Usage: ./scripts/deploy.sh
# =============================================================================

set -e

# Configuration - UPDATE THESE VALUES
SERVER_USER="root"
SERVER_IP="parser"  # <-- Change this to your Digital Ocean IP (e.g., 159.65.xxx.xxx)
APP_NAME="wcd"
APP_PORT="3006"
REMOTE_DIR="/var/www/$APP_NAME"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN}  Deploying $APP_NAME to $SERVER_IP${NC}"
echo -e "${GREEN}==========================================${NC}"

# Check if SERVER_IP is configured
if [ "$SERVER_IP" == "YOUR_SERVER_IP" ]; then
    echo -e "${RED}Error: Please edit this script and set SERVER_IP${NC}"
    exit 1
fi

# Get the script's directory (project root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

# NOTE:
# We intentionally build ON THE SERVER (Linux) to avoid platform-specific
# build/runtime issues (notably Prisma Client + Next server build artifacts).
echo -e "${YELLOW}[1/7] Syncing files to server...${NC}"
rsync -avz --delete \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.git' \
    --exclude='.env' \
    --exclude='.env.local' \
    --exclude='.env*.local' \
    --include='scripts/' \
    --include='scripts/seed_locations.py' \
    --exclude='scripts/***' \
    --exclude='.DS_Store' \
    --exclude='*.log' \
    "$PROJECT_DIR/" "$SERVER_USER@$SERVER_IP:$REMOTE_DIR/"

echo -e "${YELLOW}[2/7] Installing dependencies on server...${NC}"
# We install devDependencies because the production build step needs Tailwind/PostCSS tooling.
ssh "$SERVER_USER@$SERVER_IP" "cd $REMOTE_DIR && npm ci --legacy-peer-deps"

echo -e "${YELLOW}[3/7] Generating Prisma client on server...${NC}"
ssh "$SERVER_USER@$SERVER_IP" "cd $REMOTE_DIR && npx prisma generate"

echo -e "${YELLOW}[4/7] Syncing database schema...${NC}"
ssh "$SERVER_USER@$SERVER_IP" "cd $REMOTE_DIR && export \$(cat .env | xargs) && npx prisma db push"

echo -e "${YELLOW}[5/7] Building on server...${NC}"
# Prune devDependencies after build, but keep legacy peer-deps behavior
# (react-simple-maps has an outdated React peer range and can make npm error).
ssh "$SERVER_USER@$SERVER_IP" "cd $REMOTE_DIR && rm -rf .next && npm run build && npm prune --omit=dev --legacy-peer-deps"

echo -e "${YELLOW}[6/7] Restarting application...${NC}"
ssh "$SERVER_USER@$SERVER_IP" << REMOTE_SCRIPT
cd $REMOTE_DIR

# Check if PM2 process exists
if pm2 describe $APP_NAME > /dev/null 2>&1; then
    echo "Restarting existing PM2 process..."
    pm2 restart $APP_NAME
else
    echo "Starting new PM2 process..."
    pm2 start npm --name "$APP_NAME" -- start -- -p $APP_PORT
fi

pm2 save
REMOTE_SCRIPT

echo -e "${YELLOW}[7/7] Verifying deployment...${NC}"
sleep 3

# Check if the app is running
if ssh "$SERVER_USER@$SERVER_IP" "pm2 describe $APP_NAME | grep -q 'online'"; then
    echo -e "${GREEN}✓ Application is running${NC}"
else
    echo -e "${RED}✗ Application may have failed to start${NC}"
    echo -e "${YELLOW}Check logs with: ssh $SERVER_USER@$SERVER_IP 'pm2 logs $APP_NAME'${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN}  Deployment complete!${NC}"
echo -e "${GREEN}==========================================${NC}"
echo ""
echo "Useful commands:"
echo "  View logs:     ssh $SERVER_USER@$SERVER_IP 'pm2 logs $APP_NAME'"
echo "  Monitor:       ssh $SERVER_USER@$SERVER_IP 'pm2 monit'"
echo "  Restart:       ssh $SERVER_USER@$SERVER_IP 'pm2 restart $APP_NAME'"
echo ""
