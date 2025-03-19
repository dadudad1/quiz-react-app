# Quiz Biologie - Windows Desktop App

This guide will help you convert the React Quiz app into a standalone Windows application using Electron.

## Prerequisites

- Node.js and npm installed on your development machine
- The React Quiz app (source code)

## Quick Start (Windows)

For a quick start on Windows, follow these steps:

1. Install Node.js from [nodejs.org](https://nodejs.org/)
2. Open Command Prompt as Administrator
3. Navigate to the quiz-react-app folder: `cd path\to\quiz-react-app`
4. Build the React app: `npm run build`
5. Navigate to the electron folder: `cd electron-quiz-app`
6. Install dependencies: `npm install`
7. Create an icon: `npm run create-icon` (and follow the instructions)
8. Build the Windows app: `npm run build-all`
9. Find your Windows installer in the `dist` folder

## Detailed Instructions

### 1. Building the React App

First, you need to build the React app:

```bash
# Navigate to your React app directory
cd path/to/quiz-react-app

# Install dependencies if you haven't already
npm install

# Build the React app
npm run build
```

This will create a `build` folder with the optimized production build of your React app.

### 2. Setting Up Electron

Make sure you're in the `electron-quiz-app` directory that contains the `package.json` and `main.js` files.

```bash
# Install dependencies for Electron app
npm install
```

### 3. Create an Icon for the Application

Run the icon creation helper script:

```bash
npm run create-icon
```

Follow the instructions to create or obtain an icon file and place it in the `build` folder.

### 4. Build the Electron App

You can use the automated build script which handles everything for you:

```bash
npm run build-all
```

Or follow the manual steps:

```bash
# Copy the React build files (on Windows)
xcopy /E /I "..\build" "build"

# Build the app for Windows
npm run dist
```

The Windows installer will be created in the `dist` folder.

## Troubleshooting "Missing .exe File"

If `npm run build-all` doesn't create the .exe file, follow these steps:

### Step 1: Verify Your Build Files

First, check if the React build files are correctly copied:

```bash
npm run verify-build
```

If this reports errors, try copying the React build files manually:

```bash
# Delete the current build folder in electron-quiz-app (if it exists)
rmdir /S /Q build
# Copy the React build files
xcopy /E /I "..\build" "build"
```

### Step 2: Create a Simple Icon

Create a simple icon file:

```bash
npm run create-icon
```

This script will create the build directory if needed. Make sure to place an icon.ico file in the build folder.

### Step 3: Build Just the Electron App

Try building just the Electron app:

```bash
npm run build-electron
```

This will attempt to build the Windows installer with more debug information.

### Step 4: Check for Error Messages

Look for error messages during the build process. Common issues include:

- Missing icon file
- Issues with React build files
- Missing dependencies
- Permission issues (try running Command Prompt as Administrator)

### Step 5: Manual Build

If everything else fails, try building manually:

```bash
# Make sure you have admin privileges
# Make sure electron-builder is installed
npm install electron-builder --save-dev
# Try building with explicit arguments
npx electron-builder --win --x64
```

## Running the App in Development Mode

Test the app before building:

```bash
# Navigate to electron-quiz-app directory
cd path/to/quiz-react-app/electron-quiz-app

# Start the app
npm start
```

## Features of the Windows App

- Runs as a native Windows application
- Works offline without needing a browser
- Saves user preferences and bookmarks locally
- Has its own application icon and entry in Start Menu / Desktop
- Can be uninstalled through Windows Control Panel

## Troubleshooting

### Node.js/npm Issues

If you see errors related to Node.js or npm:

```bash
# Check your Node.js version
node -v

# Should be at least v14.x.x
# If not, download and install a newer version from nodejs.org
```

### Build Errors

If you encounter build errors:

1. Make sure you have all dependencies installed: `npm install`
2. Try running the commands manually instead of using the build script
3. Check that the React app builds properly: `cd .. && npm run build`

### Icon Issues

If your app doesn't show the custom icon:

1. Make sure the icon file is named exactly `icon.ico`
2. Place it in the `build` folder inside the `electron-quiz-app` directory
3. The icon must be in `.ico` format for Windows

## Distribution

To distribute your app:

1. Share the installer from the `dist` folder
2. Users can double-click the installer to install the app
3. The app will be installed in the Program Files folder by default
4. A shortcut will be created on the desktop and in the Start Menu 