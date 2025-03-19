# Building Your Windows Application

This guide will walk you through the process of building your Quiz Biologie application for Windows, regardless of whether you're using macOS or Windows for development.

## Prerequisites

- Node.js installed (version 14 or higher recommended)
- npm installed
- Your React app code ready

## Step 1: Build the React App

First, build your React application:

```bash
# Navigate to your React app directory (if you're in electron-quiz-app, go up one level)
cd ..

# Install dependencies if needed
npm install

# Build the React app
npm run build
```

This will create a `build` folder in your React app directory with all the compiled and optimized files.

## Step 2: Copy the Build Files to the Electron App

Now, copy the React build files to your Electron application:

```bash
# Navigate back to the electron-quiz-app directory
cd electron-quiz-app

# Run the copy-build script
npm run copy-build
```

This will copy all the necessary files from your React build to the Electron app.

## Step 3: Build the Windows Application

Now it's time to build the Windows application:

```bash
# Run the windows-build script
npm run windows-build
```

This script:
1. Checks if all required files are present
2. Creates a proper icon for your application
3. Fixes React build compatibility with Electron
4. Creates a preload.js file if needed
5. Builds the Windows application

## What Will Be Created?

The build process will create:

- A Windows executable (.exe) in the `dist` folder
- This could be either a portable executable or an installer, depending on which build succeeds

## Troubleshooting

If you encounter any issues during the build process:

### Common Issues

1. **Missing icon**: The script will create a placeholder icon if needed
2. **Path issues in React**: The script automatically fixes common path issues
3. **Electron compatibility**: Common Electron compatibility issues are fixed automatically

### If the Build Fails

If the build fails, check the error messages for specific issues:

1. Make sure all dependencies are installed: `npm install`
2. Update electron-builder: `npm install electron-builder@latest --save-dev`
3. Check that your React build is complete and doesn't have errors
4. If you're on macOS and trying to build a Windows app, try using Wine (`brew install wine`)

## For macOS Users

If you're using macOS to build a Windows app, you might encounter platform-specific issues. In this case:

1. Make sure you have Rosetta 2 installed if you're on Apple Silicon: `softwareupdate --install-rosetta`
2. Try running with the simplified portable target: `npx electron-builder --win portable --x64 --publish never`

## Building for Different Platforms

- **Windows**: The `windows-build` script is already configured for Windows
- **macOS**: You can modify the build script to target macOS by changing the target in the command
- **Linux**: Similarly, you can target Linux by modifying the build command

## Distribution

Once your build is complete, you'll find your Windows application in the `dist` folder. You can distribute this to users who can run it on Windows machines. 