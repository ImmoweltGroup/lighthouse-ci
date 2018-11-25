const { configExists, getConfig, filePathAndName } = require('../src/config')

jest.mock('fs')
jest.mock('signale', () => ({
  warn: jest.fn(),
  info: jest.fn()
}))
const { statSync } = require('fs')
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
    jest.clearAllMocks()
    jest.resetModules()
    info.mockReset()
  })
  it('should return empty object if config in current working does not exists', () => {
    statSync.mockImplementation(() => {
      throw new Error()
    })
    expect(getConfig()).toEqual({})
  })
  it('should return null if config could not be loaded', () => {
    statSync.mockImplementation(jest.fn())
    jest.doMock(filePathAndName, () => {
      throw new Error()
    })
    expect(getConfig()).toBe(null)
  })
  it('should return empty object if config evaluation fails when threshold section missed', () => {
    const config = {}
    statSync.mockImplementation(jest.fn())
    jest.doMock(filePathAndName, () => (config))
    expect(getConfig()).toEqual({})
  })
  it('should return object configuration if config successfully be loaded', () => {
    const config = {
      threshold: {
        performance: 10
      }
    }
    statSync.mockImplementation(jest.fn())
    jest.doMock(filePathAndName, () => (config))
    expect(getConfig()).toBe(config)
  })
  it('should call info when threshold section missed in configuration', () => {
    const config = {}
    statSync.mockImplementation(jest.fn())
    jest.doMock(filePathAndName, () => (config))
    expect(getConfig()).toEqual({})
    expect(info).toHaveBeenCalledTimes(2)
  })
})
