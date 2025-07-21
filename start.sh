#!/bin/bash

# 🍄 Mushroom Hunter - Quick Start Script

echo ""
echo "  🍄 MUSHROOM HUNTER"
echo "  =================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "🔧 Creating .env.local..."
    cp .env.example .env.local
    echo "⚠️  Don't forget to update .env.local with your API keys!"
fi

# Start Expo
echo ""
echo "🚀 Starting Expo development server..."
echo ""
echo "Press:"
echo "  • 'i' for iOS simulator"
echo "  • 'a' for Android emulator"
echo "  • 'w' for web browser"
echo "  • Scan QR code with Expo Go app"
echo ""

npm start