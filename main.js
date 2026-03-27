const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');
const Store = require('electron-store');
const os = require('os');
const { autoUpdater } = require('electron-updater');

const serverPromise = require('./server.js');
let serverPort;

const store = new Store();
const WORKER_URL = 'https://shrill-thunder-8da2.olivermoscropwriting.workers.dev';
let mainWindow;

function createWindow() {    
mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

mainWindow.maximize();

    mainWindow.maximize();

    const userLicense = store.get('licenseKey');

    if (userLicense) {
        axios.post(WORKER_URL, { 
            licenseKey: userLicense, 
            action: 'check' 
        }, { timeout: 3000 }).then(response => {
            if (response.data && response.data.data && response.data.data.enabled) {
                mainWindow.loadURL(`http://localhost:${serverPort}`);
            } else {
                store.delete('licenseKey');
                mainWindow.loadFile(path.join(__dirname, 'license.html'));
            }
        }).catch(error => {
            const status = error.response ? error.response.status : null;
            if (status === 401 || status === 403 || status === 404) {
                store.delete('licenseKey');
                mainWindow.loadFile(path.join(__dirname, 'license.html'));
            } else {
                mainWindow.loadURL(`http://localhost:${serverPort}`);
            }
        });
    } else {
        mainWindow.loadFile(path.join(__dirname, 'license.html'));
    }

    mainWindow.on('close', (e) => {
        const choice = dialog.showMessageBoxSync(mainWindow, {
            type: 'question',
            buttons: ['Yes', 'No'],
            title: 'Confirm Quit',
            message: 'Are you sure you want to quit? Unsaved progress will be lost.'
        });
        if (choice === 1) e.preventDefault();
        else mainWindow.destroy();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        require('electron').shell.openExternal(url);
        return { action: 'deny' };
    });
}

ipcMain.handle('verify-license', async (event, key) => {
    try {
        const response = await axios.post(WORKER_URL, { 
            licenseKey: key, 
            action: 'verify' 
        });

        if (response.data && response.data.data && response.data.data.enabled) {
            store.set('licenseKey', key);
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
});

ipcMain.handle('deactivate-license', async () => {
    const key = store.get('licenseKey');
    if (key) {
        try {
            await axios.post(WORKER_URL, { licenseKey: key, action: 'decrease' });
        } catch (e) {}
    }
    store.delete('licenseKey');
    mainWindow.loadFile(path.join(__dirname, 'license.html'));
    return true;
});

ipcMain.handle('bypass-license', () => {
    if (mainWindow) {
        mainWindow.loadURL(`http://localhost:${serverPort}`);
    }
});

ipcMain.handle('is-licensed', () => {
    return !!store.get('licenseKey');
});

autoUpdater.autoDownload = false;

    autoUpdater.on('update-available', (info) => {
        dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'Update Available',
            message: `Version ${info.version} is available. Would you like to download it now?`,
            buttons: ['Yes', 'No']
        }).then((result) => {
            if (result.response === 0) {
                dialog.showMessageBox(mainWindow, {
                    type: 'info',
                    title: 'Downloading Update',
                    message: 'The update is now downloading in the background. The app icon on your taskbar will show the progress. You will be notified you when it is ready to install.'
                });
                autoUpdater.downloadUpdate();
            }
        });
    });

    autoUpdater.on('download-progress', (progressObj) => {
        if (mainWindow) {
            mainWindow.setProgressBar(progressObj.percent / 100);
        }
    });

    autoUpdater.on('update-not-available', () => {
        dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'Up to Date',
            message: 'You are already running the latest version.'
        });
    });

    autoUpdater.on('update-downloaded', () => {
        if (mainWindow) {
            mainWindow.setProgressBar(-1);
        }
        dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'Update Ready',
            message: 'The update has been downloaded. Restart the application to apply the updates.',
            buttons: ['Restart', 'Later']
        }).then((result) => {
            if (result.response === 0) {
                autoUpdater.quitAndInstall();
            }
        });
    });

    autoUpdater.on('error', (err) => {
        console.error('Updater Error:', err);
    });

ipcMain.handle('check-for-update', () => {
    autoUpdater.checkForUpdates();
});

app.whenReady().then(async () => {
    serverPort = await serverPromise;
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', () => {
    process.exit(0);
});