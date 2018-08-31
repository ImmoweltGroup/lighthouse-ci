[![Powered by Immowelt](https://img.shields.io/badge/powered%20by-immowelt-yellow.svg?colorB=ffb200)](https://stackshare.io/immowelt-group/)
[![Build Status](https://travis-ci.org/ImmoweltGroup/lighthouse-ci.svg?branch=master)](https://travis-ci.org/ImmoweltGroup/lighthouse-ci)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovateapp.com/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# @immowelt/lighthouse-ci

> Lighthouse quality gate cli, for report generation and customizable threshold validation depending on project quality specification.

## Specifications

* Threshold validation for lighthouse categories
* Lighthouse report generation
* Parallel validation and report generation of multiple domains

# Usage

The package should mainly used throught a CI.

## CLI

```sh
yarn global add @immowelt/lighthouse-ci
```

For more information use --help

```sh
lighthouse-ci --help
```

## API

```sh
yarn add @immowelt/lighthouse-ci
```

### Examples

Run lighthouse on Immowelt and print results to console.

```js
const {launchChromeAndRunLighthouse} = require('@immowelt/lighthouse-ci')

launchChromeAndRunLighthouse('https://www.immowelt.de')
  .then(result => console.log(result.scores))

/*
[ { id: 'performance', score: 41, title: 'Performance' },
  { id: 'pwa', score: 31, title: 'Progressive Web App' },
  { id: 'accessibility', score: 57, title: 'Accessibility' },
  { id: 'best-practices', score: 60, title: 'Best Practices' },
  { id: 'seo', score: 100, title: 'SEO' } ]
*/
```

Run lighthouse on Immonet and print results to (html) report file.

```
const {launchChromeAndRunLighthouse, persistReport} = require('@immowelt/lighthouse-ci')

launchChromeAndRunLighthouse('https://www.immonet.de')
  .then(result => persistReport(result.reportName, result.report, './reports'))
```

# TODOs

* Threshold configuration via config file
* Dockerized images for direct usage in CI pipeline
* ***Unit tests are missing!***
