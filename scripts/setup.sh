#!/bin/bash

# 🍄 Mushroom Hunter Setup Script

echo "🍄 Setting up Mushroom Hunter App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Expo CLI globally if not present
if ! command -v expo &> /dev/null; then
    echo "📦 Installing Expo CLI..."
    npm install -g expo-cli
fi

# Install EAS CLI for building
if ! command -v eas &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install -g eas-cli
fi

# Setup environment variables
if [ ! -f .env.local ]; then
    echo "🔧 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your API keys!"
fi

# iOS specific setup
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Setting up iOS dependencies..."
    cd ios && pod install && cd ..
fi

# Create necessary directories
echo "📁 Creating project directories..."
mkdir -p src/assets/images
mkdir -p src/assets/fonts
mkdir -p src/assets/sounds

# Download placeholder assets
echo "🎨 Setting up placeholder assets..."
cat > src/assets/images/.gitkeep << EOL
# Placeholder for image assets
EOL

# Success message
echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your API keys"
echo "2. Run 'npm start' to launch the development server"
echo "3. Press 'i' for iOS or 'a' for Android in the terminal"
echo ""
echo "Happy mushroom hunting! 🍄"