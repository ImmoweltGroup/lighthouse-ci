#!/usr/bin/env node

const Promise = require('bluebird')
const signale = require('signale')
const {format} = require('util')
const {resolve} = require('path')
const flatten = require('lodash.flattendeep')

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
const {info, warn, error} = signale

const {launchChromeAndRunLighthouse, persistReport} = require('../src/api')

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
      warn('%i/%i reports failed', results.length, yargs.urls.length)
    }
    return results
  })
  // Report generation
  .each(result => {
    if (yargs.report) {
      const path = resolve(process.cwd(), 'reports')
      return persistReport(result.reportName, result.report, path)
    }
    return result
  })
  // Threshold validation
  .map(result => {
    info('Checking thresholds [%s]', result.url)
    return result.scores.reduce((score, value) => {
      if (value.score < yargs[value.id]) {
        if (!yargs.quiet) {
          error('%s threshold not met: %i/%i [%s]', value.title, value.score, yargs[value.id], result.url)
        }
        score.push(format('%s threshold not met: %i/%i [%s]', value.title, value.score, yargs[value.id], result.url))
      }
      return score
    }, [])
  })
  .then(flatten)
  .then(errors => process.exit(errors.length > 0 ? 1 : 0))
