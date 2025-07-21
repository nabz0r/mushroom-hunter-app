#!/bin/bash

# Generate app icons and splash screens for different platforms

echo "🎨 Generating app assets..."

# Create assets directory if it doesn't exist
mkdir -p assets

# Function to create a simple SVG icon
create_mushroom_icon() {
    cat > assets/icon.svg << 'EOL'
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="#2D5016"/>
  <circle cx="512" cy="512" r="400" fill="#8B4513"/>
  <ellipse cx="512" cy="512" rx="450" ry="350" fill="#D2691E"/>
  <circle cx="512" cy="512" r="300" fill="#8B4513"/>
  <rect x="462" y="512" width="100" height="200" fill="#FAEBD7"/>
  <text x="512" y="512" font-size="300" text-anchor="middle" dominant-baseline="middle" fill="white">🍄</text>
</svg>
EOL
}

# Create the SVG
create_mushroom_icon

# Check if ImageMagick is installed
if command -v convert &> /dev/null; then
    echo "🔧 Generating PNG icons..."
    
    # App icon
    convert assets/icon.svg -resize 1024x1024 assets/icon.png
    
    # Adaptive icon for Android
    convert assets/icon.svg -resize 512x512 assets/adaptive-icon.png
    
    # Favicon for web
    convert assets/icon.svg -resize 48x48 assets/favicon.png
    
    echo "✅ Icons generated successfully!"
else
    echo "⚠️  ImageMagick not found. Please install it to generate PNG assets."
    echo "   On macOS: brew install imagemagick"
    echo "   On Ubuntu: sudo apt-get install imagemagick"
fi

# Create splash screen
cat > assets/splash.svg << 'EOL'
<svg width="2048" height="2048" viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg">
  <rect width="2048" height="2048" fill="#2D5016"/>
  <text x="1024" y="900" font-size="400" text-anchor="middle" fill="white">🍄</text>
  <text x="1024" y="1200" font-size="120" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle" fill="white">Mushroom Hunter</text>
  <text x="1024" y="1350" font-size="60" font-family="Arial, sans-serif" text-anchor="middle" fill="#6B8E23">Chassez, Identifiez, Gagnez!</text>
</svg>
EOL

if command -v convert &> /dev/null; then
    convert assets/splash.svg -resize 2048x2048 assets/splash.png
    echo "✅ Splash screen generated!"
fi

echo "🎆 Asset generation complete!"