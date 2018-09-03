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

```sh
yarn global add @immowelt/lighthouse-ci
```

For more information use --help

```sh
lighthouse-ci --help
```

# Configuration
You are able to define a config file which must be named `lighthouse-ci.json`. Lighthouse-ci search for this config in the current working dir where you execute lighthouse-ci. The config file must contains a threshold object, which refers the lighthouse categories with the threshold scores which musst be passed.

> NOTE: **The passed threshold arguments to the cli overrides the config thresolds**

```
{
  "threshold": {
    "performance": 80,
    "pwa": 80,
    "best-practices": 80,
    "accessibility": 80,
    "seo": 80
  }
}
```

# Docker

We dockerized this package for a better usability in CI pipelines, you can use it locally like this:
```
docker pull immowelt/lighthouse-ci:latest
docker run -v /path/for/reports:/usr/src/app/lighthouse immowelt/lighthouse-ci:latest https://immowelt.de/ -r
```

> NOTE: If you want to get the generated reports locally, you need to mount a folder directly to container.

# TODOs

* ~~Threshold configuration via config file~~
* Create node API
* ~~Dockerized images for direct usage in CI pipeline~~
* ***Unit tests are missing!***
