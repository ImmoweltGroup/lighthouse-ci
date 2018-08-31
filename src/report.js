const { resolve } = require('path')
const { existsSync, mkdirSync, writeFileSync } = require('fs')

const persist = (fileName, fileData, fileDestination) => {
  if (!existsSync(fileDestination)) {
    mkdirSync(fileDestination)
  }
  const filePathAndName = resolve(fileDestination, fileName)
  writeFileSync(filePathAndName, fileData)
  return filePathAndName
}

module.exports = { persist }
