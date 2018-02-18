const dgram = require('dgram')
const net = require('net')
const isSocket = require('lib/is-socket')

test('is socket', () => {
  expect(isSocket(dgram.createSocket('udp4'))).toBe(true)
  expect(isSocket(net.createServer())).toBe(false)
})
