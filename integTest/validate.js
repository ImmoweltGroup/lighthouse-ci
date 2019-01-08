const { error, success } = require('signale')
const { resolve } = require('path')
const { statSync, readFileSync } = require('fs')

const outputFileName = 'output.txt'
const filePathAndName = resolve(process.cwd(), outputFileName)

try {
  let errorCount = 0
  statSync(filePathAndName)
  const outputFile = readFileSync(filePathAndName, 'utf8')

  if (!outputFile.includes('Configuration file loaded successfully')) {
    error('Configuration file failed loading')
    errorCount++
  }

  if (!outputFile.includes('Created report')) {
    error('Report failed creation')
    errorCount++
  }

  if (!outputFile.includes('Checking thresholds')) {
    error('Thresholds failed checking')
    errorCount++
  }

  if (errorCount > 0) {
    process.exit(1)
  } else {
    success('Integration test succeded')
    process.exit(0)
  }
} catch (e) {
  error(`${outputFileName} does not exist`)
  process.exit(1)
}
