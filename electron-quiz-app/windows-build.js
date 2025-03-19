const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting Windows build process...');

// Define paths
const electronAppDir = __dirname;
const buildDir = path.join(electronAppDir, 'build');

// 1. Check if build directory exists
if (!fs.existsSync(buildDir)) {
  console.error('ERROR: Build directory not found. Please run npm run copy-build first.');
  process.exit(1);
}

// 2. Check for index.html in build directory
const indexHtml = path.join(buildDir, 'index.html');
if (!fs.existsSync(indexHtml)) {
  console.error('ERROR: index.html not found in build directory.');
  console.error('Please make sure the React app is built and copied correctly.');
  process.exit(1);
}

// 3. Check for icon file
console.log('Checking for icon file...');
const iconPath = path.join(buildDir, 'icon.ico');

if (!fs.existsSync(iconPath)) {
  // Look for icon in possible locations
  const possibleIcons = [
    path.join(electronAppDir, 'assets', 'icon.ico'),
    path.join(electronAppDir, 'resources', 'icon.ico'),
    path.join(electronAppDir, '..', 'public', 'favicon.ico'),
    path.join(electronAppDir, '..', 'src', 'assets', 'icon.ico')
  ];
  
  let iconFound = false;
  for (const iconSource of possibleIcons) {
    if (fs.existsSync(iconSource)) {
      console.log(`Found icon at ${iconSource}, copying to build directory...`);
      fs.copyFileSync(iconSource, iconPath);
      iconFound = true;
      break;
    }
  }
  
  if (!iconFound) {
    console.warn('WARNING: No icon.ico found in build directory or other common locations.');
    console.warn('Your application will use the default Electron icon.');
    console.warn('To add a custom icon, copy your .ico file to the build directory as icon.ico');
  }
} else {
  console.log(`Icon file found at: ${iconPath}`);
}

// 4. Fix the React build for Electron compatibility
console.log('Fixing React build for Electron compatibility...');
try {
  // Check if the fix-build script exists
  const fixBuildPath = path.join(electronAppDir, 'check-react-compatibility.js');
  
  if (fs.existsSync(fixBuildPath)) {
    console.log('Running check-react-compatibility.js...');
    execSync('node check-react-compatibility.js', { 
      cwd: electronAppDir, 
      stdio: 'inherit'
    });
  } else {
    console.log('check-react-compatibility.js not found, applying basic fixes directly...');
    
    // Read index.html
    const indexHtmlContent = fs.readFileSync(indexHtml, 'utf8');
    
    // Apply basic fixes
    let updatedContent = indexHtmlContent;
    
    // 1. Add base href if it doesn't exist
    if (!updatedContent.includes('<base href="./')) {
      updatedContent = updatedContent.replace(
        '<head>',
        '<head>\n    <base href="./">'
      );
    }
    
    // 2. Fix absolute paths
    updatedContent = updatedContent
      .replace(/href="\//g, 'href="')
      .replace(/src="\//g, 'src="');
    
    // 3. Remove Content Security Policy that might block local resources
    updatedContent = updatedContent.replace(
      /<meta\s+http-equiv="Content-Security-Policy"[^>]*>/gi,
      ''
    );
    
    // Write the updated content
    if (updatedContent !== indexHtmlContent) {
      fs.writeFileSync(indexHtml, updatedContent);
      console.log('Applied basic fixes to index.html');
    } else {
      console.log('No fixes needed for index.html');
    }
  }
} catch (error) {
  console.error('WARNING: Failed to fix React build:', error.message);
  console.log('Proceeding anyway, but the app might not work correctly...');
}

// 5. Check for preload.js
const preloadPath = path.join(electronAppDir, 'preload.js');
if (!fs.existsSync(preloadPath)) {
  console.error('WARNING: preload.js not found.');
  
  // Create a simple preload.js if it doesn't exist
  console.log('Creating a simple preload.js file...');
  const simplePreload = `
// Preload script for the Electron app
const { contextBridge } = require('electron');

// Expose a minimal API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Add any specific functions you need to expose to your React app here
  getAppVersion: () => process.env.npm_package_version || '1.0.0'
});

// Log when preload script is executed
console.log('Preload script executed');

// Add DOM ready listener to help with debugging
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');
  
  // Log React mounting element
  const rootElement = document.getElementById('root');
  console.log('Root element found:', !!rootElement);
});
  `;
  
  fs.writeFileSync(preloadPath, simplePreload);
  console.log('Created a simple preload.js file');
}

// 6. Build the Windows application
console.log('\nStarting Electron build process for Windows...');
console.log('This may take a few minutes...');

try {
  // First try a simplified build command
  execSync('npx electron-builder --win portable --x64 --publish never', { 
    cwd: electronAppDir, 
    stdio: 'inherit'
  });
  
  console.log('\nBuild succeeded with portable target!');
} catch (error) {
  console.error('Portable build failed, trying with nsis target...');
  
  try {
    execSync('npx electron-builder --win nsis --x64 --publish never', { 
      cwd: electronAppDir, 
      stdio: 'inherit'
    });
    
    console.log('\nBuild succeeded with nsis target!');
  } catch (secondError) {
    console.error('Both build attempts failed.');
    console.error('First error:', error.message);
    console.error('Second error:', secondError.message);
    process.exit(1);
  }
}

// 7. Verify the build
const distDir = path.join(electronAppDir, 'dist');
if (!fs.existsSync(distDir)) {
  console.error('ERROR: dist directory not found after build. Something went wrong.');
  process.exit(1);
}

// List files in the dist directory
console.log('\nBuild files created in the dist directory:');
const distFiles = fs.readdirSync(distDir);
distFiles.forEach(file => {
  console.log(` - ${file}`);
});

console.log('\nWindows build process completed successfully!');
console.log('You can find your Windows application in the dist folder.');
console.log('If you encounter any issues running the app, check the preload.js and main.js files for compatibility issues.'); 