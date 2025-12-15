# QuoteInvoice Pro - Electron Desktop App

A professional quotation and invoice management application built with Next.js and Electron.

## Features

- 📝 Create and manage quotations and invoices
- 🎨 Customizable document templates with PDF export
- 📦 Item catalog with pre-populated services and pricing
- 👥 Customer management system
- 🖨️ Print and PDF export with template formatting
- 💾 Local data storage
- 🎯 Modern, responsive UI

## Development

### Web Development
```bash
npm run dev
```

### Electron Development
```bash
npm run electron:dev
```

### Building for Production

#### Web App
```bash
npm run build
npm run start
```

#### Electron Desktop App
```bash
npm run electron:build
```

### Building Packages Only
```bash
npm run electron:pack
```

## Project Structure

```
├── public/
│   ├── electron.js          # Electron main process
│   ├── preload.js          # Preload script for security
│   └── icon.png            # App icon (add your icon here)
├── src/
│   ├── components/         # React components
│   ├── lib/               # Utility libraries
│   ├── types/             # TypeScript type definitions
│   └── app/               # Next.js app pages
├── dist/                  # Electron build output (generated)
└── .next/                 # Next.js build output
```

## Electron Features

- **Cross-platform**: Windows, macOS, and Linux support
- **Native menus**: File, View, and Window menus with keyboard shortcuts
- **Security**: Context isolation and preload script for secure IPC
- **Deep linking**: Custom protocol handler (`quoteinvoicepro://`)
- **Standalone builds**: Proper packaging with all dependencies included

## Menu Shortcuts

- **File Menu**:
  - `Ctrl+N` / `Cmd+N`: New Quotation
  - `Ctrl+I` / `Cmd+I`: New Invoice
  - `Ctrl+S` / `Cmd+S`: Save
  - `Ctrl+E` / `Cmd+E`: Export PDF
  - `Ctrl+Q` / `Cmd+Q`: Exit

- **View Menu**:
  - `Ctrl+R` / `Cmd+R`: Reload
  - `F11`: Toggle Full Screen
  - `F12`: Toggle Developer Tools

- **Window Menu**:
  - `Ctrl+M` / `Cmd+M`: Minimize
  - `Ctrl+W` / `Cmd+W`: Close

## Build Targets

### Windows
- **NSIS Installer**: `.exe` installer with uninstaller
- **Architecture**: x64 support

### macOS
- **DMG Package**: `.dmg` disk image
- **Architecture**: x64 and ARM64 (Apple Silicon) support

### Linux
- **AppImage**: Portable `.AppImage` format
- **Architecture**: x64 support

## Configuration

### Electron Configuration
- **Main Process**: `public/electron.js`
- **Preload Script**: `public/preload.js`
- **App ID**: `com.quoteinvoicepro.app`
- **Output Directory**: `dist/`

### Production Build Process
1. **Next.js Build**: Creates standalone build in `.next/standalone/`
2. **Electron Builder**: Packages app with proper resource handling
3. **File Structure**: 
   ```
   dist/
   ├── QuoteInvoice Pro.exe (Windows)
   ├── QuoteInvoice Pro.app (macOS)
   └── QuoteInvoice Pro.AppImage (Linux)
   ```

### Security Features
- Context isolation enabled
- Node integration disabled in renderer
- Secure IPC communication via preload script
- External links open in default browser

## Development Notes

1. **Web Development**: Use `npm run dev` for web development with hot reload
2. **Electron Development**: Use `npm run electron:dev` to test desktop app
3. **Icon**: Add your app icon as `public/icon.png` (256x256px recommended)
4. **Production**: The Electron app loads built Next.js app from packaged resources
5. **Environment**: `NODE_ENV=production` is set for Electron builds

## Fixed Issues

### PDF Export Layout
- ✅ Fixed image sizing and positioning
- ✅ Consistent line spacing throughout document
- ✅ Proper table column alignment
- ✅ Template colors and fonts apply correctly
- ✅ Professional document formatting

### Electron Packaging
- ✅ Proper standalone build configuration
- ✅ Correct file paths for production
- ✅ Resource handling for cross-platform builds
- ✅ Environment variable setup for production builds

## Requirements

- Node.js 18+ 
- npm or yarn
- For development: Git (for version control)

## License

Private project - All rights reserved.