const CONFIG_DESCRIPTOR = 'lighthouse-ci.json'
const { resolve } = require('path')
const { statSync } = require('fs')
// const { info } = require('signale')

const filePathAndName = resolve(process.cwd(), CONFIG_DESCRIPTOR)

const configExists = () => {
  try {
    statSync(filePathAndName)
  } catch (e) {
    // info('Config does not exists')
    return false
  }
  return true
}

const getConfig = () => {
  if (!configExists()) { return null }
  try {
    return require(filePathAndName)
  } catch (e) {
    // info('Error while parsing config: %s', e)
    return null
  }
}

module.exports = { configExists, getConfig, filePathAndName }
