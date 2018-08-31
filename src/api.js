const Promise = require('bluebird')
const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const pick = require('lodash.pick')
const debug = require('../src/logger')
const {resolve} = require('path')
const {existsSync, mkdirSync, writeFile} = require('fs')
const {getFilenamePrefix} = require('lighthouse/lighthouse-core/lib/file-namer')

const accumulateScores = categories => categories
  .map(category => pick(category, 'id', 'score', 'title'))
  .map(category => Object.assign(category, {score: Math.round(category.score * 100)}))

const accumulateResult = result => ({
  scores: accumulateScores(Object.values(result.lhr.categories)),
  url: result.lhr.finalUrl,
  reportName: `${getFilenamePrefix(result.lhr)}.html`,
  report: result.report
})

const launchChromeAndRunLighthouse = url => {
  debug('Starting Chrome (%s)', url)
  return chromeLauncher
    .launch({chromeFlags: ['--show-paint-rects', '--headless']})
    .then(chrome => {
      const opts = {
        port: chrome.port,
        output: 'html'
      }
      debug('Running lighthouse on "%s"', url)
      return lighthouse(url, opts)
        .then(result => Promise
          .resolve(chrome.kill())
          .thenReturn(result)
          .then(accumulateResult)
        )
        .catch(e => {
          debug('Lighthouse crashed (%s) | %s', url, e.friendlyMessage || e.message)
          chrome.kill()
          return null
        })
    })
    .catch(e => {
      debug('Chrome crashed (%s) | %s', url, e.message)
      return null
    })
}

const persistReport = (fileName, fileData, fileDestination) => {
  if (!existsSync(fileDestination)) {
    debug('Creating report directory "%s"', fileDestination)
    mkdirSync(fileDestination)
  }
  const filePathAndName = resolve(fileDestination, fileName)
  debug('Creating report "%s"', fileName)
  return Promise.promisify(writeFile)(filePathAndName, fileData)
}

module.exports = {launchChromeAndRunLighthouse, persistReport}
