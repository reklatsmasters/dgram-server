# dgram-server

[![Build Status](https://travis-ci.org/reklatsmasters/dgram-server.svg?branch=master)](https://travis-ci.org/reklatsmasters/dgram-server)
[![npm](https://img.shields.io/npm/v/dgram-server.svg)](https://npmjs.org/package/dgram-server)
[![node](https://img.shields.io/node/v/dgram-server.svg)](https://npmjs.org/package/dgram-server)
[![license](https://img.shields.io/npm/l/dgram-server.svg)](https://npmjs.org/package/dgram-server)
[![downloads](https://img.shields.io/npm/dm/dgram-server.svg)](https://npmjs.org/package/dgram-server)
[![Coverage Status](https://coveralls.io/repos/github/reklatsmasters/dgram-server/badge.svg?branch=master)](https://coveralls.io/github/reklatsmasters/dgram-server?branch=master)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

Stream-based UDP server.

Doesn't properly work with [cluster](https://nodejs.org/api/cluster.html).

## Usage
```js
const dgramsrv = require('dgram-server')

const server = dgramsrv.createServer()

server.on('socket', (socket) => {
  socket.on('data', (data) => {
    console.log('got %s bytes from %s:%s', data.length, socket.remoteAddress, socket.remotePort)

    socket.write('hello, world!', () => {
      socket.close()
    })
  })
})

server.listen(() => {
  console.log('udp server started on 0.0.0.0:%s', server.address().port)
})
```

## API

* `createServer([options: Object]): Server`

Creates a new UDP server. Also accept all options for `dgram.createSocket()`. If `options.socket` is provided, these options will be ignored.

* `option.socket: dgram.Socket`

An optional internal `dgram` socket used as transport layer.

* `class Server`

This class is used to create a UDP server. `Server` is an [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) with the following events:

* `Event: 'socket'`
  * `socket: unicast.Socket`

Emitted when a new association is made. `socket` is an instance of `unicast.Socket`.

* `Event: 'listening'`

Emitted when the server has been bound after calling `server.listen()`

* `server.listen([port: number[, host: string]][, callback: function])`
* `server.listen()`

Start a server listening for associations. When the server starts listening, the `'listening'` event will be emitted. The last parameter `callback` will be added as a listener for the `'listening'` event.

* `server.close()`

Close the underlying socket and stop listening for data on it.

* `server.address(): Object`

Returns the bound address, the address family name, and port of the server as reported by the operating system. Useful to find which port was assigned when getting an OS-assigned address. Returns an object with `port`, `family`, and `address` properties: `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`.

Don't call `server.address()` until the 'listening' event has been emitted.

* `server.connections: number`

The number of concurrent associations on the server.

## Reated

* [`unicast`](https://npmjs.org/package/unicast) - Unicast implementation of UDP Datagram sockets.

## License

MIT, 20!8 (c) Dmitriy Tsvettsikh
