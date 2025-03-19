const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const fsPromises = require('fs').promises;

// Keep a global reference of the window object to prevent garbage collection
let mainWindow;

// Check if the build directory exists
function checkBuildDir() {
  const buildDir = path.join(__dirname, 'build');
  const indexPath = path.join(buildDir, 'index.html');
  
  if (!fs.existsSync(buildDir)) {
    dialog.showErrorBox(
      'Build Directory Missing',
      'The build directory is missing. Please run "npm run copy-build" to copy the React build files.'
    );
    return false;
  }
  
  if (!fs.existsSync(indexPath)) {
    dialog.showErrorBox(
      'index.html Missing',
      'index.html is missing from the build directory. Please make sure the React app is built correctly.'
    );
    return false;
  }
  
  return true;
}

function createWindow() {
  // First check if build directory is present
  if (!checkBuildDir()) {
    app.quit();
    return;
  }

  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false,         // Don't allow Node integration for security
      contextIsolation: true,         // Protect against prototype pollution
      enableRemoteModule: false,      // Disable remote module
      preload: path.join(__dirname, 'preload.js'), // Add a preload script (we'll create this)
    },
    icon: path.join(__dirname, 'build/icon.ico'),
    backgroundColor: '#f5f5f5'        // Set a background color to avoid white flash
  });

  // Load the app
  const indexPath = path.join(__dirname, 'build', 'index.html');
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: indexPath,
    protocol: 'file:',
    slashes: true
  });
  
  console.log('Loading application from:', startUrl);
  console.log('Index.html exists:', fs.existsSync(indexPath));
  
  // Add error handler for loading URL
  mainWindow.webContents.on('did-fail-load', () => {
    console.error('Failed to load:', startUrl);
    dialog.showErrorBox(
      'Failed to Load Application',
      `Could not load the application from: ${indexPath}\nPlease make sure the React build files are correctly copied.`
    );
  });
  
  mainWindow.loadURL(startUrl);
  
  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
  
  // Log when page has finished loading
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Application loaded successfully');
  });

  // Emitted when the window is closed
  mainWindow.on('closed', function () {
    // Dereference the window object
    mainWindow = null;
  });
}

// Create the window when Electron is ready
app.on('ready', createWindow);

// Quit when all windows are closed
app.on('window-all-closed', function () {
  // On macOS applications keep their menu bar active until the user quits explicitly
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On macOS re-create a window when the dock icon is clicked and no other windows are open
  if (mainWindow === null) {
    createWindow();
  }
});

// Add IPC handler for reading files
ipcMain.handle('read-file', async (event, filePath) => {
  try {
    // Construct the absolute path to the file
    const resourcePath = process.env.NODE_ENV === 'development'
      ? path.join(process.cwd(), 'public', filePath)
      : path.join(process.resourcesPath, 'app', 'public', filePath);

    // Read and parse the file
    const data = await fsPromises.readFile(resourcePath, 'utf8');
    
    // If the file ends with .json, parse it as JSON
    if (filePath.endsWith('.json')) {
      return JSON.parse(data);
    }
    
    // Otherwise return as text
    return data;
  } catch (error) {
    console.error('Error reading file:', filePath, error);
    throw error;
  }
}); 