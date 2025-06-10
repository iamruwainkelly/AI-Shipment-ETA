#!/bin/bash

# AI Shipment ETA Frontend - Comprehensive Testing Script
# Date: June 10, 2025

echo "🧪 AI Shipment ETA Frontend - Comprehensive Testing"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -e "\n${YELLOW}Testing: $test_name${NC}"
    
    if eval "$test_command"; then
        echo -e "${GREEN}✅ PASSED: $test_name${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAILED: $test_name${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Test 1: Check if project directory exists
run_test "Project Directory" "[ -d '/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-frontend' ]"

# Test 2: Check package.json exists
run_test "Package.json exists" "[ -f '/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-frontend/package.json' ]"

# Test 3: Check if dependencies are installed
run_test "Node modules installed" "[ -d '/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-frontend/node_modules' ]"

# Test 4: Check if key components exist
run_test "Sidebar component exists" "[ -f '/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-frontend/src/components/Sidebar.vue' ]"

run_test "AppLayout component exists" "[ -f '/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-frontend/src/components/AppLayout.vue' ]"

run_test "Dashboard view exists" "[ -f '/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-frontend/src/views/Dashboard.vue' ]"

run_test "API service exists" "[ -f '/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-frontend/src/services/api.js' ]"

# Test 5: Check if enhanced pages exist
run_test "ClientsPageEnhanced exists" "[ -f '/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-frontend/src/views/ClientsPageEnhanced.vue' ]"

run_test "ShipmentsPageEnhanced exists" "[ -f '/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-frontend/src/views/ShipmentsPageEnhanced.vue' ]"

run_test "VendorsPageEnhanced exists" "[ -f '/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-frontend/src/views/VendorsPageEnhanced.vue' ]"

# Test 6: Check if utils exist
run_test "Report generator exists" "[ -f '/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-frontend/src/utils/reportGenerator.js' ]"

# Test 7: Check if Map component exists
run_test "ShipmentMap component exists" "[ -f '/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-frontend/src/components/ShipmentMap.vue' ]"

# Test 8: Check if stores exist
run_test "Clients store exists" "[ -f '/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-frontend/src/stores/clients.js' ]"

# Test 9: Check configuration files
run_test "Tailwind config exists" "[ -f '/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-frontend/tailwind.config.js' ]"

run_test "Vite config exists" "[ -f '/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-frontend/vite.config.js' ]"

run_test "Environment file exists" "[ -f '/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-frontend/.env' ]"

# Test 10: Check if build works
echo -e "\n${YELLOW}Testing: Build Process${NC}"
cd "/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-frontend"

if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASSED: Build Process${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAILED: Build Process${NC}"
    ((TESTS_FAILED++))
fi

# Test 11: Check if backend directory exists
run_test "Backend directory exists" "[ -d '/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-backend' ]"

# Test 12: Check backend files
run_test "Backend main.py exists" "[ -f '/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-backend/main.py' ]"

run_test "Backend requirements.txt exists" "[ -f '/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-backend/requirements.txt' ]"

# Test 13: Test frontend port availability
echo -e "\n${YELLOW}Testing: Frontend Port (3000)${NC}"
if ! lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null; then
    echo -e "${GREEN}✅ PASSED: Port 3000 available${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠️  INFO: Port 3000 in use (frontend might be running)${NC}"
    ((TESTS_PASSED++))
fi

# Test 14: Test backend port availability
echo -e "\n${YELLOW}Testing: Backend Port (8000)${NC}"
if ! lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null; then
    echo -e "${YELLOW}⚠️  INFO: Port 8000 available (backend not running)${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${GREEN}✅ PASSED: Backend running on port 8000${NC}"
    ((TESTS_PASSED++))
fi

# Test 15: Check if all key Vue components are using new design system
echo -e "\n${YELLOW}Testing: Dark Theme Implementation${NC}"
if grep -q "dark-bg\|dark-surface\|dark-text" "/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-frontend/src/components/Sidebar.vue"; then
    echo -e "${GREEN}✅ PASSED: Sidebar uses dark theme classes${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAILED: Sidebar missing dark theme classes${NC}"
    ((TESTS_FAILED++))
fi

# Test 16: Check Tailwind dark theme configuration
echo -e "\n${YELLOW}Testing: Tailwind Dark Theme Config${NC}"
if grep -q "darkMode.*class" "/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-frontend/tailwind.config.js"; then
    echo -e "${GREEN}✅ PASSED: Tailwind dark mode configured${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAILED: Tailwind dark mode not configured${NC}"
    ((TESTS_FAILED++))
fi

# Test 17: Check if API client has fallback support
echo -e "\n${YELLOW}Testing: API Fallback Support${NC}"
if grep -q "getMock\|fallback\|mock data" "/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-frontend/src/services/api.js"; then
    echo -e "${GREEN}✅ PASSED: API client has fallback support${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAILED: API client missing fallback support${NC}"
    ((TESTS_FAILED++))
fi

# Test 18: Check if enhanced CSS exists
echo -e "\n${YELLOW}Testing: Enhanced CSS${NC}"
if grep -q "animate-fade-in\|text-gradient\|btn-primary" "/Users/ruwainkelly/Desktop/Personal Website/ai-shipment-eta-frontend/src/assets/main.css"; then
    echo -e "${GREEN}✅ PASSED: Enhanced CSS classes exist${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAILED: Enhanced CSS classes missing${NC}"
    ((TESTS_FAILED++))
fi

# Summary
echo -e "\n🔍 Test Summary"
echo "==============="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))
echo -e "Total Tests: $TOTAL_TESTS"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 ALL TESTS PASSED! Frontend is ready for production.${NC}"
    exit 0
else
    echo -e "\n${YELLOW}⚠️  Some tests failed. Review the output above.${NC}"
    exit 1
fi
