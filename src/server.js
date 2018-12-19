const fs = require('fs')
const https = require('https')

const PORT = 8081
const HOST = 'localhost'
const PATH = `${__dirname}/server`

const options = {
  key: fs.readFileSync(`${PATH}/key.pem`),
  cert: fs.readFileSync(`${PATH}/certificate.pem`),
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
