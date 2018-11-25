const CONFIG_DESCRIPTOR = 'lighthouse-ci.json'
const CONFIG_THRESHOLD_DESCRIPTOR = 'thresholds'
const { resolve } = require('path')
const { statSync } = require('fs')
const { info, warn } = require('signale')

const filePathAndName = resolve(process.cwd(), CONFIG_DESCRIPTOR)

const configExists = () => {
  try {
    statSync(filePathAndName)
  } catch (e) {
    info('%s config file does not exists', CONFIG_DESCRIPTOR)
    return false
  }
  return true
}

const getConfig = () => {
  if (!configExists()) { return {} }
  try {
    const config = require(filePathAndName)
    evaluateConfiguration(config)
    info('Configuration file loaded successfully')
    return config
  } catch (e) {
    warn('Error while parsing config: %s', e)
    return null
  }
}

const evaluateConfiguration = (config) => {
  if (!config.hasOwnProperty(CONFIG_THRESHOLD_DESCRIPTOR)) {
    info('Threshold configuration irgnored, because threshold section missed in config file')
  }
}

module.exports = { configExists, getConfig, filePathAndName, CONFIG_THRESHOLD_DESCRIPTOR }
