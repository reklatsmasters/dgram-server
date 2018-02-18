const dgram = require('dgram')
const createServer = require('lib/create-server')
const Server = require('lib/server')

jest.mock('lib/server')
jest.mock('lib/is-socket', () => jest.fn().mockImplementation((x) => x === true))
jest.mock('dgram', () => ({
  createSocket: jest.fn().mockImplementation(() => true)
}))

beforeEach(() => {
  Server.mockClear()
})

test('call 1', () => {
  expect(createServer({socket: true})).toBeInstanceOf(Server)
  expect(Server).toHaveBeenLastCalledWith({socket: true})
})

test('call 2', () => {
  const options = {
    type: 'udp4'
  }

  const calledOptions = {
    socket: true,
    ...options
  }

  expect(createServer(options)).toBeInstanceOf(Server)
  expect(dgram.createSocket).toHaveBeenCalledWith(calledOptions)
  expect(Server).toHaveBeenCalledWith(calledOptions)
})
