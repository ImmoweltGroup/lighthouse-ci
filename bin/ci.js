#!/usr/bin/env node

const Promise = require('bluebird')
const signale = require('signale')
const { resolve } = require('path')
const flatten = require('lodash.flattendeep')
const pick = require('lodash.pick')
const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')

// Prepare CLI
// eslint-disable--next-line
const yargs = require('yargs')
  // Always English
  .detectLocale(false)
  .usage('$0 [<urls>...]', 'Run lighthouse to the given urls')
  .option('report', {
    description: 'Generate a (html) report',
    type: 'boolean',
    alias: 'r'
  })
  .option('quiet', {
    description: 'Just shut up',
    type: 'boolean',
    alias: 'q'
  })
  .option('performance', {
    description: 'Performance',
    type: 'integer',
    default: 0
  })
  .option('pwa', {
    description: 'PWA',
    type: 'integer',
    default: 0
  })
  .option('best-practices', {
    description: 'Best Practices',
    type: 'integer',
    default: 0
  })
  .option('accessibility', {
    description: 'Accessibility',
    type: 'integer',
    default: 0
  })
  .option('seo', {
    description: 'SEO',
    type: 'integer',
    default: 0
  })
  .version()
  .help()
  .argv

if (yargs.quiet) {
  signale.disable()
}

const { info, success, warn, error } = signale
const { persist } = require('../src/report')
const { accumulate, evaluate } = require('../src/result')
const { getConfig } = require('../src/config')

const { options: optionsFromConfig, thresholds: thresholdsFromConfig } = getConfig()

const launchChromeAndRunLighthouse = url => Promise
  .resolve(chromeLauncher.launch({ chromeFlags: ['--show-paint-rects', '--headless'] }))
  .then(chrome => {
    info('Chrome running on port %i {%s}', chrome.port, url)
    const opts = {
      port: chrome.port,
      output: 'html',
      ...optionsFromConfig
    }
    return lighthouse(url, opts)
      .then(result => {
        success('Lighthouse scheduled {%s}', url)
        return Promise
          .resolve(chrome.kill())
          .thenReturn(result)
          .then(accumulate)
      })
      .catch(e => {
        warn('Lighthouse stopped {%s} | %s', url, e.friendlyMessage || e.message)
        chrome.kill()
        return null
      })
  })
  .catch(e => {
    warn('Chrome crashed {%s} | %s', url, e.message)
    return null
  })

Promise
  .try(() => {
    if (!yargs.urls) {
      throw new Error('No URLs provided')
    }
    info('Running [%s]', yargs.urls.join(', '))
    return yargs.urls
  })
  // Start scheduling (Chrome, Lighthouse)
  .then(urls => Promise
    .all(urls.map(launchChromeAndRunLighthouse))
    .filter(result => result !== null))
  // Evaluate results
  .then(results => {
    if (results.length === 0) {
      throw new Error('No results received due to previous errors')
    }
    if (results.length < yargs.urls.length) {
      warn('Some reports failed %i/%i', results.length, yargs.urls.length)
    }
    return results
  })
  // Report generation
  .each(result => {
    if (yargs.report) {
      const path = resolve(process.cwd(), 'reports')
      return persist(result.reportName, result.report, path)
        .then(file => info('Created report "%s"', file))
    }
    return result
  })
  // Threshold validation
  .map(result => {
    info('Checking thresholds {%s}', result.url)
    return evaluate(result, pick(yargs, 'performance', 'pwa', 'best-practices', 'accessibility', 'seo'), thresholdsFromConfig)
  })
  .then(flatten)
  .each(e => {
    error(e)
    return e
  })
  .then(errors => process.exit(errors.length > 0 ? 1 : 0))
