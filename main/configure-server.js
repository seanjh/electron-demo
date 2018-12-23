const { BrowserWindow, ipcMain } = require('electron')
const { RESTART_SERVER } = require('../common/events')
const { server } = require('./windows')

ipcMain.on(RESTART_SERVER, (event) => {
  BrowserWindow.getAllWindows().forEach((bw, i) => {
    console.debug(`#${i} BrowserWindow ${bw.id}, WebContents ${bw.webContents.id}`)
  })
  console.debug(`server BrowserWindow ${server.id}, WebContents ${server.webContents.id}`)

  console.debug(`We need to restart the server! (id=${event.sender.id})`)
  server.webContents.reload()
})
