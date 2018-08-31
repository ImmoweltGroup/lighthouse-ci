#!/bin/bash

_kill_chromium_xcfb() {
  kill -TERM $chromium
  wait $chromium
  kill -TERM $xvfb
}

trap _kill_chromium_xcfb SIGTERM

XVFB_WHD=${XVFB_WHD:-1280x720x16}

Xvfb :99 -ac -screen 0 $XVFB_WHD -nolisten tcp &
xvfb=$!

export DISPLAY=:99

chromium --no-sandbox $@ &
chromium=$!

wait $chromium
wait $xvfb
