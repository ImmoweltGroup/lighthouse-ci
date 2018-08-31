const { persist } = require('../src/report')

jest.mock('fs')

describe('report', () => {
  const { mkdirSync, existsSync } = require('fs')
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('.persist() should persist', () => {
    const persisted = persist('report.html', 'data', '/dest')
    expect(persisted).toBe('/dest/report.html')
  })
  it('.persist() should create a folder if path destination does not exists', () => {
    existsSync.mockImplementation(() => false)
    persist('file', 'rawData', '/path/to/check')
    expect(mkdirSync.mock.calls.length).toBe(1)
  })
  it('.persist() should skip folder creation if path destination does not exists', () => {
    existsSync.mockImplementation(() => true)
    persist('file', 'rawData', '/path/to/check')
    expect(mkdirSync.mock.calls.length).toBe(0)
  })
})
