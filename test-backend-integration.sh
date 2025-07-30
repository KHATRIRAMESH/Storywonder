#!/bin/bash

# Test script to verify backend integration
echo "🧪 Testing Backend Integration..."
echo "================================"

# Check if backend is running
echo "1. Checking if backend server is running on port 8000..."
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend server is running"
else
    echo "❌ Backend server is not running on port 8000"
    echo "   Please start your backend server first"
    exit 1
fi

# Test authentication endpoint
echo "2. Testing authentication endpoint..."
AUTH_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/auth_test.json http://localhost:8000/api/auth/verify)
if [ "$AUTH_RESPONSE" = "401" ] || [ "$AUTH_RESPONSE" = "403" ]; then
    echo "✅ Auth endpoint responding (expects authentication)"
elif [ "$AUTH_RESPONSE" = "200" ]; then
    echo "✅ Auth endpoint responding (public access)"
else
    echo "❌ Auth endpoint error: HTTP $AUTH_RESPONSE"
fi

# Test with sample Bearer token (this will likely fail but shows the endpoint is working)
echo "3. Testing with sample Bearer token..."
BEARER_RESPONSE=$(curl -s -w "%{http_code}" -H "Authorization: Bearer sample-token" -o /tmp/bearer_test.json http://localhost:8000/api/auth/verify)
echo "   Response: HTTP $BEARER_RESPONSE"

echo ""
echo "🎯 Frontend Integration Status:"
echo "==============================="

# Check if Next.js development server is running
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend server is running on port 3000"
else
    echo "❌ Frontend server is not running on port 3000"
    echo "   Run: npm run dev"
fi

# Check environment configuration
if [ -f ".env.local" ]; then
    if grep -q "NEXT_PUBLIC_API_URL=http://localhost:8000" .env.local; then
        echo "✅ API URL configured correctly in .env.local"
    else
        echo "❌ API URL not configured in .env.local"
    fi
else
    echo "❌ .env.local file not found"
fi

echo ""
echo "📋 Next Steps:"
echo "=============="
echo "1. Make sure your backend server is running on port 8000"
echo "2. Start the frontend with: npm run dev"
echo "3. Visit http://localhost:3000 and sign in with Clerk"
echo "4. Check the dashboard and create-story pages for backend integration"
echo ""
echo "🔍 The frontend will now:"
echo "  - Verify user authentication with your backend"
echo "  - Load user profile and subscription data"
echo "  - Display story limits and usage"
echo "  - Show connection status and errors"
