const Promise = require('bluebird')
const {resolve} = require('path')
const {existsSync, mkdirSync, writeFile} = require('fs')

const persist = (fileName, fileData, fileDestination) => {
  if (!existsSync(fileDestination)) {
    mkdirSync(fileDestination)
  }
  const filePathAndName = resolve(fileDestination, fileName)
  return Promise
    .promisify(writeFile)(filePathAndName, fileData)
    .thenReturn(filePathAndName)
}

module.exports = {persist}
