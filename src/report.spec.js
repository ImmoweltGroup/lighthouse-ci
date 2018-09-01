const { persist } = require('../src/report')

jest.mock('fs')

describe('report', () => {
  const { mkdirSync, existsSync } = require('fs')
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('.persist() should persist and create a folder if path destination does not exists', () => {
    existsSync.mockImplementation(() => false)
    const persisted = persist('report.html', 'data', '/dest')
    expect(mkdirSync.mock.calls.length).toBe(1)
    expect(persisted).toBe('/dest/report.html')
  })
  it('.persist() should persist and skip folder creation because path destination does exist', () => {
    existsSync.mockImplementation(() => true)
    const persisted = persist('report.html', 'data', '/dest')
    expect(mkdirSync.mock.calls.length).toBe(0)
    expect(persisted).toBe('/dest/report.html')
  })
})
