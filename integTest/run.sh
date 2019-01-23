#!/usr/bin/env bash

# break on all failures
set -e

cd integTest

# Integration Test for report generation without default configuration loading
node ./../bin/ci.js https://immowelt.de -r > output.txt
node ./validate.js

# Integration Test for report generation without custom configuration loading
# node ./../bin/ci.js https://immowelt.de -r > output.txt --config ci-config.json
node ./validate.js

cd -
