#!/usr/bin/env node

const Promise = require('bluebird')
const debug = require('../src/logger')
const {format} = require('util')
const {resolve} = require('path')
const flatten = require('lodash.flattendeep')
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

Promise
  .try(() => {
    if (!yargs.urls) {
      throw new Error('No URLs provided')
    }
    if (!yargs.quiet) {
      console.info('Running')
    }
    debug('URLs: %s', JSON.stringify(yargs.urls))
    return yargs.urls
  })
  .then(urls => Promise
    .all(urls.map(launchChromeAndRunLighthouse))
    .filter(result => result !== null))
  .then(results => {
    if (results.length === 0) {
      throw new Error('No results received due to previous errors')
    }
    if (!yargs.quiet) {
      console.info('Reports succeed %i/%i', results.length, yargs.urls.length)
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
  // Threshold validation
  .map(result => result.scores.reduce((score, value) => {
    debug('Checking thresholds (%s)', result.url)
    if (value.score < yargs[value.id]) {
      if (!yargs.quiet) {
        console.error('%s threshold not met: %i/%i (%s)', value.title, value.score, yargs[value.id], result.url)
      }
      score.push(format('%s threshold not met: %i/%i (%s)', value.title, value.score, yargs[value.id], result.url))
    }
    return score
  }, []))
  .then(flatten)
  .then(errors => process.exit(errors.length > 0 ? 1 : 0))
