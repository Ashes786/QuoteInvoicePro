#!/bin/bash

echo "Building QuoteInvoice Pro for Windows..."

# Check if we're on Linux and need to cross-compile
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Detected Linux system. Setting up cross-compilation..."
    
    # Install wine if not present
    if ! command -v wine >/dev/null 2>&1; then
        echo "Installing Wine for cross-compilation..."
        sudo apt-get update
        sudo apt-get install -y wine
    fi
    
    # Set up Wine environment
    export WINEPREFIX="$HOME/.wine"
    export WINEARCH=win64
    
    # Build the application
    echo "Building Next.js application..."
    npm run build
    
    echo "Creating Windows executable..."
    NODE_ENV=production npx electron-builder --win --publish=never
    
    echo "Windows build completed!"
    echo "Check the 'dist' folder for Windows executables."
    
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Detected macOS system."
    NODE_ENV=production npm run build
    npx electron-builder --mac --publish=never
    
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin"* ]]; then
    echo "Detected Windows system."
    NODE_ENV=production npm run build
    npx electron-builder --win --publish=never
    
else
    echo "Unknown OS: $OSTYPE"
    echo "Please run this on Windows, macOS, or Linux."
    exit 1
fi