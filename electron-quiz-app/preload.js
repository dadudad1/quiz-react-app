
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
  