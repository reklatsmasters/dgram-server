const Server = require('lib/server')

jest.mock('lib/is-socket', () =>
  jest.fn().mockImplementation((x) => !(x === false))
)
jest.mock('unicast', () => ({
  createSocket: jest.fn().mockImplementation((options) => ({
    options,
    process: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
  }))
}))
jest.mock('events')

test('should require socket', () => {
  expect(() => new Server({socket: false}))
    .toThrowError(new TypeError('Expected dgram socket.'))
})

test('should init', () => {
  const socket = {
    address: jest.fn(),
    on: jest.fn()
  }

  const server = new Server({ socket })

  expect(server.connections).toEqual(0)
})
