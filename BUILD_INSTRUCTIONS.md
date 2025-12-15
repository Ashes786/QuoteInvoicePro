# Build Instructions for QuoteInvoice Pro

## Prerequisites
- Node.js 18+ installed
- All dependencies installed: `npm install`

## Build Commands

### Development
```bash
npm run dev                    # Start development server
npm run electron:dev            # Start Electron in development mode
```

### Production Builds

#### Cross-Platform Builds (Recommended)
```bash
npm run electron:build:all      # Build for Windows, macOS, and Linux
npm run electron:build:win       # Build Windows installer and portable
npm run electron:build:mac       # Build macOS DMG
npm run electron:build:linux     # Build Linux AppImage
```

#### Simple Build
```bash
npm run electron:build          # Build for current platform only
npm run electron:pack           # Build unpacked directory
```

## Output Files

### Windows
- **Installer**: `dist/QuoteInvoice Pro Setup x.x.x.exe` (NSIS installer)
- **Portable**: `dist/QuoteInvoice Pro x.x.x.exe` (Portable executable)

### macOS
- **DMG**: `dist/QuoteInvoice Pro-x.x.x.dmg` (Disk image)

### Linux
- **AppImage**: `dist/QuoteInvoice Pro-x.x.x.AppImage` (Portable executable)

## Windows Build Notes

1. **Icon File**: Replace `public/ICON_README.txt` with actual `public/icon.ico`
2. **Cross-compilation**: Building Windows from Linux may have limitations
3. **For best results**: Build on Windows target platform

## Troubleshooting

### Build Issues
- **Memory**: If build fails, try: `NODE_OPTIONS="--max-old-space-size=4096"`
- **Dependencies**: Ensure all electron packages are in `devDependencies`
- **Permissions**: Make sure files have correct read/write permissions

### Runtime Issues
- **Missing .NET**: Windows installer checks for .NET Framework 4.7.2+
- **Path issues**: Use portable version if installer fails
- **Permissions**: May need administrator rights for installer

## Distribution

### Windows
- Upload `QuoteInvoice Pro Setup x.x.x.exe` for distribution
- Portable version available for users without install rights

### macOS
- Upload `.dmg` file to App Store or direct distribution
- Ensure code signing for production distribution

### Linux
- Upload `.AppImage` file for distribution
- Most universal Linux format

## Development Server
Access at: http://localhost:3000
Electron development: `npm run electron:dev`