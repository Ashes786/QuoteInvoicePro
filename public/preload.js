const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Menu actions
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-new-quotation', callback);
    ipcRenderer.on('menu-new-invoice', callback);
    ipcRenderer.on('menu-save', callback);
    ipcRenderer.on('menu-export-pdf', callback);
  },
  
  // Remove listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
  
  // App info
  getVersion: () => process.env.npm_package_version || '1.0.0',
  getPlatform: () => process.platform,
  
  // File operations (if needed)
  saveFile: (data, filename) => {
    ipcRenderer.invoke('save-file', data, filename);
  }
});

// Handle development messages
window.addEventListener('DOMContentLoaded', () => {
  console.log('Electron preload script loaded');
});