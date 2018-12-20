const { session } = require('electron')

const ENV = process.env.NODE_ENV || 'prod'
const DEBUG_SERVER = ENV === 'dev'

session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      'Content-Security-Policy': [
        "default-src 'none'",
        "object-src 'none'",
        "script-src 'self' 'unsafe-inline'",
      ],
    },
  })
})

module.exports = {
  ENV, DEBUG_SERVER,
}
