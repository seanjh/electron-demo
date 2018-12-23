/* global document */
const { ipcRenderer } = require('electron')
const { RESTART_SERVER } = require('../common/events')

const btn = document.getElementById('restart')

function restart(e) {
  e.preventDefault()
  console.debug('Clicked restart!')
  ipcRenderer.send(RESTART_SERVER)
}

btn.onclick = restart
