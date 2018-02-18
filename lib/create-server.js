const dgram = require('dgram')
const isSocket = require('./is-socket')
const Server = require('./server')

module.exports = createServer

/**
 * Creates a new UDP server.
 * @param {object} options
 */
function createServer(options = {}) {
  if (!isSocket(options.socket)) {
    options.socket = dgram.createSocket(options)
  }

  return new Server(options)
}
