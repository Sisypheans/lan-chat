import { BrowserWindow, Menu } from 'electron'
import menuconfig from '../config/menu'
import config from '@config'
import setIpc from './ipcMain'
import upload from './checkupdate'
import DownloadUpdate from './downloadFile'
import { winURL, loadingURL } from '../config/StaticPath'

var loadWindow = null
var mainWindow = null

function createMainWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    minHeight: 600,
    useContentSize: true,
    width: 1000,
    minWidth: 1000,
    show: false,
    frame: config.IsUseSysTitle,
    titleBarStyle: 'hidden',
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: false,
      // 如果是开发模式可以使用devTools
      devTools: process.env.NODE_ENV === 'development',
      enableRemoteModule: true,
      // devTools: true,
      // 在macos中启用橡皮动画
      scrollBounce: process.platform === 'darwin'
    }
  })
  global.wc = mainWindow
  // 这里设置只有开发环境才注入显示开发者模式
  if (process.env.NODE_ENV === 'development') {
    menuconfig.push({
      label: '开发者设置',
      submenu: [{
        label: '切换到开发者模式',
        accelerator: 'CmdOrCtrl+I',
        role: 'toggledevtools'
      }]
    })
  }
  // 载入菜单
  const menu = Menu.buildFromTemplate(menuconfig)
  Menu.setApplicationMenu(menu)
  mainWindow.loadURL(winURL)

  setIpc.Mainfunc(mainWindow, config.IsUseSysTitle)
  upload.Update(mainWindow)
  DownloadUpdate.download(mainWindow)

  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.show()
  })
  if (config.UseStartupChart) loadWindow.destroy()

  if (process.env.NODE_ENV === 'development') mainWindow.webContents.openDevTools(true)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function loadingWindow () {
  loadWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    backgroundColor: '#222',
    skipTaskbar: true,
    transparent: true,
    resizable: false,
    webPreferences: { experimentalFeatures: true }
  })

  loadWindow.loadURL(loadingURL)

  loadWindow.show()

  setTimeout(() => {
    createMainWindow()
  }, 2000)

  loadWindow.on('closed', () => {
    loadWindow = null
  })
}

function initWindow () {
  if (config.UseStartupChart) {
    return loadingWindow()
  } else {
    return createMainWindow()
  }
}
export default initWindow
