const CONFIG_DESCRIPTOR = 'lighthouse-ci.json'
const CONFIG_THRESHOLD_DESCRIPTOR = 'threshold'
const { resolve } = require('path')
const { statSync } = require('fs')
// const { info } = require('signale')

const filePathAndName = resolve(process.cwd(), CONFIG_DESCRIPTOR)

const configExists = () => {
  try {
    statSync(filePathAndName)
  } catch (e) {
    // info('Config file does not exists')
    return false
  }
  return true
}

const getConfig = () => {
  if (!configExists()) { return null }
  try {
    const config = require(filePathAndName)
    evaluateConfiguration(config)
    // info('Configuration file loaded successfully')
    return config
  } catch (e) {
    // info('Error while parsing config: %s', e)
    return null
  }
}

const evaluateConfiguration = (config) => {
  if (!config.hasOwnProperty(CONFIG_THRESHOLD_DESCRIPTOR)) {
    throw new Error('Threshold configuration irgnored, because threshold section missed in config file')
  }
}

module.exports = { configExists, getConfig, filePathAndName, CONFIG_THRESHOLD_DESCRIPTOR }
