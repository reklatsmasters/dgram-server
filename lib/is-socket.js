const dgram = require('dgram')

module.exports = isSocket

/**
 * Check if an argument is an instance of dgram.Socket.
 * @param {any} socket
 * @returns {boolean}
 */
function isSocket(socket) {
  return socket instanceof dgram.Socket
}
