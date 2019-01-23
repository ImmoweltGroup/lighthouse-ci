FROM romischart/node-8-chrome

USER root

#
# Install the lighthouse ci globally.
#
ARG LIGHTHOUSE_CI_VERSION="latest"
RUN yarn global add @immowelt/lighthouse-ci@"$LIGHTHOUSE_CI_VERSION" \
  && mkdir -p /usr/src/app/lighthouse-ci

WORKDIR /usr/src/app/lighthouse-ci

ENTRYPOINT ["lighthouse-ci"]
