#!/usr/bin/env node

const Promise = require('bluebird')
const debug = require('../src/logger')
const {format} = require('util')
const {resolve} = require('path')
const {launchChromeAndRunLighthouse, persistReport} = require('../')

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
    description: 'Be quiet',
    type: 'boolean',
    default: false,
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

Promise
  .try(() => {
    if (!yargs.urls) {
      throw new Error('No URLs provided')
    }
    debug('Initializing %s', JSON.stringify(yargs.urls))
    return yargs.urls
  })
  .then(urls => Promise
    .all(urls.map(launchChromeAndRunLighthouse))
    .filter(result => result !== null))
  .then(results => {
    if (results.length === 0) {
      throw new Error('No results received due to previous errors')
    }
    debug('Reports succeed %i/%i', results.length, yargs.urls.length)
    return results
  })
  .each(result => {
    if (yargs.report) {
      const path = resolve(__dirname, '../reports')
      return persistReport(result.reportName, result.report, path)
    }
    return result
  })
  .catch(e => {
    throw e
  })
  // Threshold validation
  .each(result => {
    result.scores.forEach(score => {
      if (score.score < yargs[score.id]) {
        throw new Error(format('%s threshold not met: %i/%i', score.title, score.score, yargs[score.id]))
      }
    })
  })
  // Exit process with proper exit code
  .then(() => process.exit(0))
  .catch(e => {
    if (!yargs.quiet) {
      console.error(e.message)
    }
    process.exit(1)
  })
