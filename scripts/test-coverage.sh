#!/bin/bash

# 🧪 Test Coverage Report Script

echo "🧪 Running tests with coverage..."

# Clear previous coverage
rm -rf coverage

# Run tests with coverage
npm test -- --coverage --watchAll=false

# Check if tests passed
if [ $? -eq 0 ]; then
    echo "✅ Tests passed!"
    
    # Open coverage report in browser
    if command -v open &> /dev/null; then
        open coverage/lcov-report/index.html
    elif command -v xdg-open &> /dev/null; then
        xdg-open coverage/lcov-report/index.html
    else
        echo "📊 Coverage report generated at: coverage/lcov-report/index.html"
    fi
    
    # Display coverage summary
    echo ""
    echo "📊 Coverage Summary:"
    cat coverage/lcov-report/index.html | grep -A 4 "<div class='fl pad1y space-right2'>" | grep -E "[0-9]+%" | head -4
else
    echo "❌ Tests failed!"
    exit 1
fi