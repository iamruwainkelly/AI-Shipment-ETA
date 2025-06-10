#!/bin/bash

# 🚀 AI Shipment ETA Predictor - Vercel Deployment Script
# Deploy to: https://vercel.com/iamruwainkellys-projects
# Portfolio: https://iamruwainkelly.vercel.app/

echo "🚀 Starting AI Shipment ETA Predictor Deployment to Vercel"
echo "============================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the AI-Shipment-ETA directory."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI is available"

# Clean and prepare for deployment
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf node_modules/.cache/

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix build errors before deploying."
    exit 1
fi

echo "✅ Build completed successfully"

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist directory not found after build."
    exit 1
fi

echo "📁 Build output verified in dist/ directory"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo "🎯 Target: https://vercel.com/iamruwainkellys-projects"

# Login to Vercel (if not already logged in)
vercel whoami || vercel login

# Deploy with production flag
vercel --prod --confirm

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 DEPLOYMENT SUCCESSFUL!"
    echo "============================================================"
    echo "✅ AI Shipment ETA Predictor has been deployed to Vercel"
    echo "📱 Your app should be available at:"
    echo "   https://ai-shipment-eta.vercel.app"
    echo "   OR"
    echo "   https://[random-string].vercel.app"
    echo ""
    echo "📊 Portfolio Integration:"
    echo "   Update your portfolio at https://iamruwainkelly.vercel.app/"
    echo "   with the live demo URL from above"
    echo ""
    echo "🔧 Next Steps:"
    echo "   1. Test the deployed application"
    echo "   2. Update portfolio with correct live demo URL"
    echo "   3. Verify all features work in production"
    echo "============================================================"
else
    echo "❌ Deployment failed! Please check the error messages above."
    exit 1
fi
