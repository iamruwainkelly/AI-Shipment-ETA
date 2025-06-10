#!/bin/bash

# AI Shipment ETA Predictor - Build and Deploy Script
# Created: June 10, 2025
# Purpose: Complete build verification and deployment preparation

echo "🚀 AI Shipment ETA Predictor - Build & Deploy Script"
echo "=================================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project directory
PROJECT_DIR="/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-frontend"

echo -e "${BLUE}📁 Navigating to project directory...${NC}"
cd "$PROJECT_DIR" || exit 1

echo -e "${BLUE}🔧 Installing dependencies...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo -e "${BLUE}🏗️  Building project...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build completed successfully${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${BLUE}🧪 Running linting...${NC}"
npm run lint

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Linting passed${NC}"
else
    echo -e "${YELLOW}⚠️  Linting completed with warnings${NC}"
fi

echo -e "${BLUE}📊 Checking build size...${NC}"
if [ -d "dist" ]; then
    BUILD_SIZE=$(du -sh dist | cut -f1)
    echo -e "${GREEN}📦 Build size: ${BUILD_SIZE}${NC}"
    
    # List main assets
    echo -e "${BLUE}📁 Main build assets:${NC}"
    ls -la dist/assets/ | head -10
else
    echo -e "${RED}❌ Build directory not found${NC}"
    exit 1
fi

echo -e "${BLUE}🔍 Verifying critical files...${NC}"

# Check critical Vue files
CRITICAL_FILES=(
    "src/App.vue"
    "src/main.js"
    "src/router/index.js"
    "src/components/Sidebar.vue"
    "src/components/ShipmentMap.vue"
    "src/components/ExportReport.vue"
    "src/views/Dashboard.vue"
    "src/views/ClientsPageEnhanced.vue"
    "src/views/ShipmentsPageEnhanced.vue"
    "src/views/VendorsPageEnhanced.vue"
    "src/views/TrackerPage.vue"
    "src/stores/clients.js"
    "src/stores/shipments.js"
)

ALL_CRITICAL_EXIST=true

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file - MISSING${NC}"
        ALL_CRITICAL_EXIST=false
    fi
done

if [ "$ALL_CRITICAL_EXIST" = true ]; then
    echo -e "${GREEN}✅ All critical files verified${NC}"
else
    echo -e "${RED}❌ Some critical files are missing${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 SUCCESS! AI Shipment ETA Predictor is ready for deployment!${NC}"
echo -e "${BLUE}📋 Next steps:${NC}"
echo -e "   1. Deploy to Vercel: ${YELLOW}npx vercel --prod${NC}"
echo -e "   2. Configure auto-redirect from / to /dashboard"
echo -e "   3. Test live deployment functionality"
echo ""
echo -e "${BLUE}🔗 Local development server:${NC}"
echo -e "   ${YELLOW}npm run dev${NC} - Starts on http://localhost:5173"
echo ""
echo -e "${GREEN}✨ All critical issues resolved and deployment ready!${NC}"