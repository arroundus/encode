import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import os from "os";

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

let mainWindow;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, "icons/icon.png"), // tray icon
    width: 1000,
    height: 600,
    frame: false,
    titleBarStyle: "hidden",
    autoHideMenuBar: false,
    useContentSize: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  ipcMain.on("closeApp", () => {
    mainWindow.close();
  });
  ipcMain.on("minimizeApp", () => {
    mainWindow.minimize();
  });
  ipcMain.on("maximizeApp", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow.maximize();
    }
  });
  mainWindow.on("maximize", () => {
    mainWindow.webContents.send("isMaximized");
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
