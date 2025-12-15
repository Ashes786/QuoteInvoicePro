@echo off
echo Building QuoteInvoice Pro for Windows...
echo.

REM Check if we're on Windows
if not "%OS%"=="Windows_NT" (
    echo ERROR: This script must be run on Windows to build Windows executables.
    echo Please run this on a Windows machine or use a Windows VM.
    pause
    exit /b 1
)

REM Set environment variables
set NODE_ENV=production

REM Build the Next.js application
echo Building Next.js application...
call npm run build

REM Create the Windows executable using electron-builder
echo Creating Windows executable...
call npx electron-builder --win --publish=never

echo.
echo Build completed! Check the 'dist' folder for output files.
echo.
pause