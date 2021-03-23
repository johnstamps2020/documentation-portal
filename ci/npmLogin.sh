#!/bin/bash
set -eux

npm-cli-login -u ${ARTIFACTORY_USERNAME} -p ${ARTIFACTORY_PASSWORD} -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/jutro-suite-npm-dev
npm config set registry https://artifactory.guidewire.com/api/npm/jutro-suite-npm-dev/