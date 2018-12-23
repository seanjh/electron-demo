/**
 * POC Electron & Server application
 * Reference implementation: github.com/electron/electron-api-demos
 */
const { app, BrowserWindow } = require('electron')
const config = require('./config')
const windows = require('./main/windows')

let win
let server

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance() {
  if (process.mas) return

  app.requestSingleInstanceLock()

  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) {
        win.restore()
      }
      win.focus()
    }
  })
}

function initialize() {
  makeSingleInstance(win)

  console.debug(`ENV=${config.ENV} (DEBUG=${config.DEBUG})`)

  win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      webgl: false,
      webaudio: false,
      plugins: false,
    },
  })
  windows.win = win
  win.loadFile('render/index.html')

  win.on('closed', () => {
    server.close()
    win = null
    server = null
  })

  server = new BrowserWindow({
    show: config.DEBUG,
    webPreferences: {
      nodeIntegration: true,
      webgl: false,
      webaudio: false,
      plugins: false,
    },
  })
  windows.server = server
  server.loadFile('server/index.html')

  if (config.DEBUG) {
    [win, server].forEach((bw) => {
      bw.webContents.openDevTools()
      win.maximize()
      require('devtron').install() // eslint-disable-line global-require
    })
  }

  require('./main/configure-server.js') // eslint-disable-line global-require
}

app.on('ready', initialize)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    initialize()
  }
})
