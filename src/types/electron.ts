// Electron API types for the renderer process
export interface ElectronAPI {
  onMenuAction: (callback: (action: string) => void) => void;
  removeAllListeners: (channel: string) => void;
  getVersion: () => string;
  getPlatform: () => string;
  saveFile: (data: any, filename: string) => void;
}

// Extend the Window interface to include electronAPI
declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}