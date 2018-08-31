const Promise = require('bluebird')
const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const pick = require('lodash.pick')
const {success, warn, info} = require('signale')
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
  return chromeLauncher
    .launch({chromeFlags: ['--show-paint-rects', '--headless']})
    .then(chrome => {
      info('Chrome running on port %i [%s]', chrome.port, url)
      const opts = {
        port: chrome.port,
        output: 'html'
      }
      return lighthouse(url, opts)
        .then(result => {
          success('Lighthouse scheduled [%s]', url)
          return Promise
            .resolve(chrome.kill())
            .thenReturn(result)
            .then(accumulateResult)
        })
        .catch(e => {
          warn('Lighthouse failed [%s] | %s', url, e.friendlyMessage || e.message)
          chrome.kill()
          return null
        })
    })
    .catch(e => {
      warn('Chrome crashed [%s] | %s', url, e.message)
      return null
    })
}

const persistReport = (fileName, fileData, fileDestination) => {
  if (!existsSync(fileDestination)) {
    mkdirSync(fileDestination)
  }
  const filePathAndName = resolve(fileDestination, fileName)
  return Promise.promisify(writeFile)(filePathAndName, fileData)
    .then(() => info('Created report "%s/%s"', fileDestination, fileName))
}

module.exports = {launchChromeAndRunLighthouse, persistReport}
