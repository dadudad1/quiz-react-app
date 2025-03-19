const fs = require('fs-extra');
const path = require('path');

console.log('Starting to copy React build files to Electron app...');

// Define paths
const reactAppDir = path.join(__dirname, '..');
const electronAppDir = __dirname;
const reactBuildDir = path.join(reactAppDir, 'build');
const electronBuildDir = path.join(electronAppDir, 'build');

console.log(`React build directory: ${reactBuildDir}`);
console.log(`Electron build directory: ${electronBuildDir}`);

// Check if React build directory exists
if (!fs.existsSync(reactBuildDir)) {
  console.error('ERROR: React build directory not found!');
  console.error('Please build the React app first by running:');
  console.error('cd .. && npm run build');
  process.exit(1);
}

// Remove existing Electron build directory if it exists
if (fs.existsSync(electronBuildDir)) {
  console.log('Removing existing Electron build directory...');
  fs.rmSync(electronBuildDir, { recursive: true, force: true });
}

// Create Electron build directory
console.log('Creating new Electron build directory...');
fs.mkdirSync(electronBuildDir);

// Copy React build files to Electron app
console.log('Copying build files...');
copyFolderRecursive(reactBuildDir, electronAppDir);

console.log('Checking if copy was successful...');
if (fs.existsSync(path.join(electronBuildDir, 'index.html'))) {
  console.log('SUCCESS: React build files copied to Electron app!');
} else {
  console.error('ERROR: Failed to copy build files properly!');
  process.exit(1);
}

// Function to recursively copy a folder
function copyFolderRecursive(source, destination) {
  const targetFolder = path.join(destination, path.basename(source));
  
  // Create the target folder if it doesn't exist
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }
  
  // Copy all files and subfolders
  const entries = fs.readdirSync(source, { withFileTypes: true });
  
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(targetFolder, entry.name);
    
    if (entry.isDirectory()) {
      // Recursive call for directories
      copyFolderRecursive(sourcePath, targetFolder);
    } else {
      // Copy file
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

console.log('Copy process completed!');
console.log('You can now run "npm run windows-build" to build the Windows app.');

async function copyFiles() {
  try {
    // Ensure the public/capitole directory exists
    await fs.ensureDir(path.join(__dirname, 'public', 'capitole'));

    // Copy chapter files from the React app's public directory
    await fs.copy(
      path.join(__dirname, '..', 'public', 'capitole'),
      path.join(__dirname, 'public', 'capitole'),
      { overwrite: true }
    );

    console.log('Successfully copied chapter files to Electron public directory');
  } catch (err) {
    console.error('Error copying files:', err);
    process.exit(1);
  }
}

copyFiles(); 