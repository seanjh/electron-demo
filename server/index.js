const fs = require('fs')
const https = require('https')

console.debug(`process.versions:\n${JSON.stringify(process.versions)}`)
console.debug(`process.platform: ${process.platform}`)

const PORT = 8081
const HOST = 'localhost'

const options = {
  key: fs.readFileSync(`${__dirname}/key.pem`),
  cert: fs.readFileSync(`${__dirname}/certificate.pem`),
}

const server = https.createServer(options, (req, res) => {
  console.log(`Received request: ${req}`)
  res.end()
})

server.listen(PORT, HOST)
console.log(`Listening on ${HOST}:${PORT}`)

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})
