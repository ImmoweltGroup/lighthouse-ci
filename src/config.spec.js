const { configExists, getConfig, filePathAndName } = require('../src/config')

jest.mock('fs')

describe('config', () => {
  const { statSync } = require('fs')
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('.configExists() should return false if config in current working dir does not exists', () => {
    statSync.mockImplementation(() => {throw new Error()})
    expect(configExists()).toBe(false)
  })
  it('.configExists() should return true if config in current working dir does exist', () => {
    statSync.mockImplementation(jest.fn())
    expect(configExists()).toBe(true)
  })
  it('.getConfig() should return null if config in current working does not exists', () => {
    statSync.mockImplementation(() => {
      throw new Error()
    })
    expect(getConfig()).toBe(null)
  })
  it('.getConfig() should return null if config could not be loaded', () => {
    statSync.mockImplementation(jest.fn())
    jest.doMock(filePathAndName, () => {
      throw new Error()
    })
    expect(getConfig()).toBe(null)
  })
  it('.getConfig() should return object if config successfully be loaded', () => {
    statSync.mockImplementation(jest.fn())
    jest.doMock(filePathAndName, () => ({}))
    expect(typeof getConfig()).toBe('object')
  })
})
