#!/bin/bash

# =============================================================================
# WCD Sanity Studio Deploy Script
# Builds and deploys Sanity Studio to your server
# Usage: ./scripts/deploy-studio.sh [SERVER_IP]
# =============================================================================

set -e

# Configuration
SERVER_IP="${1:-YOUR_SERVER_IP}"
STUDIO_DIR="/var/www/wcd-studio"
LOCAL_STUDIO_DIR="./studio"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=========================================="
echo "  Deploying Sanity Studio"
echo -e "==========================================${NC}"

# Check if server IP is provided
if [ "$SERVER_IP" == "YOUR_SERVER_IP" ]; then
    echo -e "${RED}[ERROR] Please provide server IP as argument${NC}"
    echo "Usage: ./scripts/deploy-studio.sh YOUR_SERVER_IP"
    exit 1
fi

# Check if studio directory exists
if [ ! -d "$LOCAL_STUDIO_DIR" ]; then
    echo -e "${RED}[ERROR] Studio directory not found at $LOCAL_STUDIO_DIR${NC}"
    exit 1
fi

# Check if .env file exists
if [ ! -f "$LOCAL_STUDIO_DIR/.env" ]; then
    echo -e "${YELLOW}[WARNING] No .env file found in studio directory${NC}"
    echo "Creating .env from environment variables or prompting..."
    
    if [ -z "$SANITY_STUDIO_PROJECT_ID" ]; then
        read -p "Enter Sanity Project ID: " SANITY_STUDIO_PROJECT_ID
    fi
    
    if [ -z "$SANITY_STUDIO_DATASET" ]; then
        SANITY_STUDIO_DATASET="production"
    fi
    
    cat > "$LOCAL_STUDIO_DIR/.env" << EOF
SANITY_STUDIO_PROJECT_ID=$SANITY_STUDIO_PROJECT_ID
SANITY_STUDIO_DATASET=$SANITY_STUDIO_DATASET
EOF
    echo -e "${GREEN}[OK] Created .env file${NC}"
fi

# Navigate to studio directory
cd "$LOCAL_STUDIO_DIR"

# Install dependencies
echo -e "${YELLOW}[1/4] Installing dependencies...${NC}"
npm install

# Build studio
echo -e "${YELLOW}[2/4] Building Sanity Studio...${NC}"
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo -e "${RED}[ERROR] Build failed - dist directory not found${NC}"
    exit 1
fi

# Create remote directory
echo -e "${YELLOW}[3/4] Creating remote directory...${NC}"
ssh root@$SERVER_IP "mkdir -p $STUDIO_DIR/dist"

# Deploy to server
echo -e "${YELLOW}[4/4] Deploying to server...${NC}"
rsync -avz --delete dist/ root@$SERVER_IP:$STUDIO_DIR/dist/

echo ""
echo -e "${GREEN}=========================================="
echo "  Deployment complete!"
echo -e "==========================================${NC}"
echo ""
echo "Studio is now available at: https://studio.wcd.llama.energy"
echo ""
echo "If SSL is not set up yet, run on the server:"
echo "  certbot --nginx -d studio.wcd.llama.energy"
echo ""
