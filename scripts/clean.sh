#!/bin/bash

# 🧹 Clean Project Script

echo "🧹 Cleaning Mushroom Hunter project..."

# Function to safely remove directories
safe_remove() {
    if [ -d "$1" ]; then
        echo "  Removing $1..."
        rm -rf "$1"
    fi
}

# Function to safely remove files
safe_remove_file() {
    if [ -f "$1" ]; then
        echo "  Removing $1..."
        rm -f "$1"
    fi
}

# Clean node modules
echo "📦 Cleaning dependencies..."
safe_remove "node_modules"
safe_remove_file "package-lock.json"
safe_remove_file "yarn.lock"

# Clean build artifacts
echo "🏗️ Cleaning build artifacts..."
safe_remove ".expo"
safe_remove "dist"
safe_remove "build"
safe_remove "android/app/build"
safe_remove "ios/build"
safe_remove "ios/Pods"
safe_remove_file "ios/Podfile.lock"

# Clean test artifacts
echo "🧪 Cleaning test artifacts..."
safe_remove "coverage"
safe_remove ".jest"

# Clean cache
echo "💾 Cleaning cache..."
safe_remove ".cache"
safe_remove ".parcel-cache"
safe_remove ".metro-cache"

# Clean temporary files
echo "🗑️ Cleaning temporary files..."
find . -name "*.log" -type f -delete
find . -name ".DS_Store" -type f -delete
find . -name "*.tmp" -type f -delete

# Clean Watchman
if command -v watchman &> /dev/null; then
    echo "👁️ Cleaning Watchman..."
    watchman watch-del-all
fi

# Clear React Native cache
if command -v npx &> /dev/null; then
    echo "📱 Cleaning React Native cache..."
    npx react-native-clean-project --remove-iOS-build --remove-iOS-pods
fi

echo ""
echo "✅ Project cleaned successfully!"
echo ""
echo "Next steps:"
echo "1. Run 'npm install' to reinstall dependencies"
echo "2. Run 'cd ios && pod install' for iOS"
echo "3. Run 'npm start' to start development"