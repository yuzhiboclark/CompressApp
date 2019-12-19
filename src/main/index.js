'use strict'

import { app, BrowserWindow, Menu, Tray, dialog } from 'electron'
import path from 'path'
import pkg from '../../package.json'
import './localBridge'
import './onlineBridge'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    width: 900,
    opacity: 0.96,
    useContentSize: true,
    maximizable: false,
    // transparent: true,
    resizable: false,
    show: false
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
    taryIcon.destroy()
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // 自定义windows任务栏
  const taryIcon = new Tray(path.join(__static, './tray/tray-icon.png'))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'reload',
      role: 'reload'
    }, {
      label: 'about',
      type: 'normal',
      toolTip: 'aboout',
      click: () => {
        dialog.showMessageBox({
          type: 'info',
          title: 'about',
          message: 'zhiozhou@Cid<959418392@qq.com>',
          detail: `version: ${pkg.version}`
        })
      }
    }, {
      label: 'quit',
      role: 'quit'
    }
  ])
  taryIcon.on('click', () => {
    taryIcon.popUpContextMenu(contextMenu)
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
