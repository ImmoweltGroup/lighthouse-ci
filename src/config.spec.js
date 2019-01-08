const { configExists, getConfig } = require('../src/config')

jest.mock('fs')
jest.mock('signale', () => ({
  warn: jest.fn(),
  info: jest.fn()
}))
const { statSync, readFileSync } = require('fs')
const { info } = require('signale')

describe('config.configExists()', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should return false if config in current working dir does not exists', () => {
    statSync.mockImplementation(() => { throw new Error() })
    expect(configExists()).toBe(false)
  })
  it('should return true if config in current working dir does exist', () => {
    statSync.mockImplementation(jest.fn())
    expect(configExists()).toBe(true)
  })
})

describe('config.getConfig()', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    info.mockReset()
  })
  it('should return empty object if config in current working does not exists', () => {
    statSync.mockImplementation(() => {
      throw new Error()
    })
    expect(getConfig()).toEqual({})
  })
  it('should return null if config could not be loaded', () => {
    readFileSync.mockImplementation(() => (JSON.stringify(null)))
    expect(getConfig()).toBe(null)
  })
  it('should return empty object if config evaluation fails when threshold section missed', async () => {
    const config = {}
    readFileSync.mockImplementation(() => (JSON.stringify(config)))
    expect(getConfig()).toEqual({})
  })
  it('should return object configuration if config successfully be loaded', () => {
    const config = {
      threshold: {
        performance: 10
      }
    }
    readFileSync.mockImplementation(() => (JSON.stringify(config)))
    expect(getConfig()).toEqual(config)
  })
  it('should call info when threshold section missed in configuration', () => {
    const config = {}
    readFileSync.mockImplementation(() => (JSON.stringify(config)))
    expect(getConfig()).toEqual({})
    expect(info).toHaveBeenCalledTimes(2)
  })
})
