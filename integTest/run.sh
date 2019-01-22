#!/usr/bin/env bash

# break on all failures
set -e

cd integTest

# Integration Test for report generation
node ./../bin/ci.js https://immowelt.de -r > output.txt

node ./validate.js

cd -
