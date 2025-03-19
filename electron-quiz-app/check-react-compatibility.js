const fs = require('fs');
const path = require('path');

console.log('Checking and fixing React build for Electron compatibility...');

// Define paths
const buildDir = path.join(__dirname, 'build');
const indexHtmlPath = path.join(buildDir, 'index.html');

// Check if build directory exists
if (!fs.existsSync(buildDir)) {
  console.error('ERROR: Build directory not found!');
  console.error('Please run npm run copy-build first.');
  process.exit(1);
}

// Check if index.html exists
if (!fs.existsSync(indexHtmlPath)) {
  console.error('ERROR: index.html not found in build directory!');
  process.exit(1);
}

try {
  // Read index.html content
  let content = fs.readFileSync(indexHtmlPath, 'utf8');
  let modified = false;

  // 1. Add base href if it doesn't exist
  if (!content.includes('<base href="./')) {
    console.log('Adding base href tag...');
    content = content.replace(
      '<head>',
      '<head>\n    <base href="./">'
    );
    modified = true;
  }

  // 2. Fix absolute paths in href and src attributes
  if (content.includes('href="/') || content.includes('src="/')) {
    console.log('Fixing absolute paths...');
    content = content
      .replace(/href="\//g, 'href="')
      .replace(/src="\//g, 'src="');
    modified = true;
  }

  // 3. Remove any Content Security Policy meta tags that might block local resources
  if (content.includes('Content-Security-Policy')) {
    console.log('Removing Content Security Policy...');
    content = content.replace(
      /<meta\s+http-equiv="Content-Security-Policy"[^>]*>/gi,
      ''
    );
    modified = true;
  }

  // Save changes if any were made
  if (modified) {
    fs.writeFileSync(indexHtmlPath, content);
    console.log('Successfully applied compatibility fixes to index.html');
  } else {
    console.log('No compatibility fixes needed for index.html');
  }

  // Additional checks for manifest.json
  const manifestPath = path.join(buildDir, 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    console.log('Checking manifest.json...');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    let manifestModified = false;

    // Fix start_url if it starts with /
    if (manifest.start_url && manifest.start_url.startsWith('/')) {
      manifest.start_url = manifest.start_url.substring(1);
      manifestModified = true;
    }

    // Fix icon paths if they start with /
    if (manifest.icons) {
      manifest.icons.forEach(icon => {
        if (icon.src && icon.src.startsWith('/')) {
          icon.src = icon.src.substring(1);
          manifestModified = true;
        }
      });
    }

    if (manifestModified) {
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log('Fixed paths in manifest.json');
    }
  }

  console.log('Compatibility check completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Error while fixing compatibility:', error);
  process.exit(1);
} 