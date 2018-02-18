const Emitter = require('events')
const unicast = require('unicast')
const isDgramSocket = require('./is-socket')

const pStore = Symbol('store')
const pSocket = Symbol('socket')
const pIsListening = Symbol('isListening')

const noop = () => {}

module.exports = class Server extends Emitter {
  constructor(options = {}) {
    super()

    if (!isDgramSocket(options.socket)) {
      throw new TypeError('Expected dgram socket.')
    }

    this[pSocket] = options.socket
    this[pIsListening] = isListening(this[pSocket])
    this[pStore] = new Map()

    if (this[pIsListening]) {
      process.nextTick(() => this.emit('listening'))
    }

    this[pSocket].on('message', (data, rinfo) => {
      const key = rinfo.address + ':' + rinfo.port
      let socket = this[pStore].get(key)

      if (!socket) {
        socket = createSocket(this[pSocket], rinfo.port, rinfo.address)

        this[pStore].set(key, socket)
        socket.once('close', () => this[pStore].delete(key))

        process.nextTick(() => this.emit('socket', socket))
      }

      socket.process(data)
    })
  }

  get connections() {
    return this[pStore].size
  }

  address() {
    return this[pSocket].address()
  }

  listen(port, host, callback = noop) {
    if (this[pIsListening]) {
      throw new Error('Socket already bound.')
    }

    if (isFunction(host)) {
      callback = host
      host = defaultAddress(this[pSocket].type)
    }

    if (isFunction(port)) {
      callback = port
      port = 0
      host = defaultAddress(this[pSocket].type)
    }

    if (arguments.length === 0) {
      port = 0
      host = defaultAddress(this[pSocket].type)
      callback = noop
    }

    this[pSocket].bind(port, host, callback)
    this[pSocket].once('listening', () => this.emit('listening'))
  }

  close(callback) {
    this[pStore].forEach(socket => socket.close())
    this[pStore].clear()

    this[pSocket].close(callback)
  }
}

/**
 * Check if socket already bound.
 * @param {dgram.Socket} socket - dgram socket.
 * @returns {boolean}
 */
function isListening(socket) {
  try {
    socket.address()
    return true
  } catch (err) {
    return false
  }
}

/**
 * Check if argument is a function.
 * @param {any} fn
 * @returns {boolean}
 */
function isFunction(fn) {
  return typeof fn === 'function'
}

/**
 * Get default address for every socket type.
 * @param {string} type - 'udp4' or 'udp6' socket type
 * @returns {string}
 */
function defaultAddress(type) {
  return type === 'udp4' ? '0.0.0.0' : '::'
}

/**
 * Creates a child socket for every new ip / port pair.
 * @param {dgram.Socket} transport
 * @param {number} remotePort
 * @param {string} remoteAddress
 * @returns {unicast.Socket}
 */
function createSocket(transport, remotePort, remoteAddress) {
  const socket = unicast.createSocket({
    socket: transport,
    remoteAddress,
    remotePort,
    closeTransport: false
  })

  // Remove added listener for `message` event.
  // We will handle data using #process method.
  const listeners = transport.listeners('message')
  transport.removeListener('message', listeners.pop())

  return socket
}
