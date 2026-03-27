const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    verifyLicense: (key) => ipcRenderer.invoke('verify-license', key),
    deactivateLicense: () => ipcRenderer.invoke('deactivate-license'),
    bypassLicense: () => ipcRenderer.invoke('bypass-license'),
    checkForUpdate: () => ipcRenderer.invoke('check-for-update'),
    isLicensed: () => ipcRenderer.invoke('is-licensed')
});