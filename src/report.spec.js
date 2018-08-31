const {persist} = require('../src/report')

jest.mock('fs')

describe('report', () => {
  it('.persist() should persist', () => {
    const persisted = persist('report.html', 'data', '/dest')
    expect(persisted).toBe('/dest/report.html')
  })
})
