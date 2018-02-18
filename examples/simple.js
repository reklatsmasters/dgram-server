const dgram = require('dgram')
const fs = require('fs')
const dgramsrv = require('../')

const server = dgramsrv.createServer()

server.on('socket', socket => {
  socket.pipe(fs.createWriteStream(socket.remotePort + '.txt', { encoding: 'utf8' }))
})

server.listen(() => {
  console.log('[server] udp server started on 0.0.0.0:%s', server.address().port)
})

const client1 = dgram.createSocket('udp4')
const client2 = dgram.createSocket('udp4')

const interval = setInterval(() => {
  const addr = server.address()

  client1.send(Buffer.from('client1 ' + Date.now() + '\n'), addr.port, addr.address)
  client2.send(Buffer.from('client2 ' + Date.now() + '\n'), addr.port, addr.address)
}, 1e2)

process.on('SIGINT', () => {
  clearInterval(interval)
  client1.close()
  client2.close()
  server.close()
})
