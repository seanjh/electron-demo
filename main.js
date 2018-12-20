/**
 * Agent POC
 * Reference implementation: github.com/electron/electron-api-demos
 */
const { app, BrowserWindow } = require('electron')
const { ENV, DEBUG_SERVER } = require('./main/config')

let win
let server

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

function start() {
  makeSingleInstance()

  console.debug(`ENV=${ENV} (DEBUG_SERVER=${DEBUG_SERVER})`)
  win = new BrowserWindow({ width: 1000, height: 800 })
  win.loadFile('index.html')
  win.on('closed', () => {
    server.close()
    win = null
    server = null
  })

  server = new BrowserWindow({
    show: DEBUG_SERVER,
    webgl: false,
    webaudio: false,
    plugins: false,
  })
  server.loadFile('server/index.html')
}

app.on('ready', start)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    start()
  }
})
