#!/usr/bin/env bash

# break on all failures
set -e

# Integration Test for report generation
node ./bin/ci.js https://immowelt.de -r
