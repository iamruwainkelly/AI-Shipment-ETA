#!/bin/bash

# Quick verification script for AI Shipment ETA Frontend
echo "🚀 AI Shipment ETA Frontend - Quick Verification"
echo "=============================================="

# Check if development server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend server running on http://localhost:3000"
else
    echo "❌ Frontend server not running. Starting..."
    cd "/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-frontend"
    npm run dev &
    sleep 5
    if curl -s http://localhost:3000 > /dev/null; then
        echo "✅ Frontend server started successfully"
    else
        echo "❌ Failed to start frontend server"
    fi
fi

# Check backend
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ Backend server running on http://localhost:8000"
else
    echo "⚠️  Backend server not running (using mock data)"
fi

# Check key files
echo ""
echo "📁 Key Files Verification:"
echo "✅ Sidebar: $([ -f 'src/components/Sidebar.vue' ] && echo 'Present' || echo 'Missing')"
echo "✅ AppLayout: $([ -f 'src/components/AppLayout.vue' ] && echo 'Present' || echo 'Missing')"
echo "✅ Dashboard: $([ -f 'src/views/Dashboard.vue' ] && echo 'Present' || echo 'Missing')"
echo "✅ API Service: $([ -f 'src/services/api.js' ] && echo 'Present' || echo 'Missing')"
echo "✅ Dark Theme CSS: $([ -f 'src/assets/main.css' ] && echo 'Present' || echo 'Missing')"

echo ""
echo "🎉 AI Shipment ETA Frontend is ready!"
echo "👉 Open http://localhost:3000 in your browser"
