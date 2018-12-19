const {app, BrowserWindow} = require('electron')

let win
let server

function start() {
  console.log('Launching main window.')
  win = new BrowserWindow({width: 800, height: 600})
  win.loadFile('main.html')
  win.on('closed', () => {
    console.log('Closing server window.')
    server.close()
    win = null
    server = null
  })

  console.log('Launching server window.')
  server = new BrowserWindow({show: false, webgl: false, webaudio: false, plugins: false})
  server.loadFile('server.html')
  server.on('ready-to-show', () => {
    console.log('Ready to show server window.')
  })
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
    createWindow()
  }
})
