#!/bin/bash
set -eux

# legacy Jutro repos
npm-cli-login -u ${ARTIFACTORY_USERNAME} -p ${ARTIFACTORY_PASSWORD} -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/jutro-npm-dev -s @jutro
npm config set @jutro:registry https://artifactory.guidewire.com/api/npm/jutro-npm-dev/
npm-cli-login -u ${ARTIFACTORY_USERNAME} -p ${ARTIFACTORY_PASSWORD} -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/globalization-npm-release -s @gwre-g11n
npm config set @gwre-g11n:registry https://artifactory.guidewire.com/api/npm/globalization-npm-release/
npm-cli-login -u ${ARTIFACTORY_USERNAME} -p ${ARTIFACTORY_PASSWORD} -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/elixir -s @elixir
npm config set @elixir:registry https://artifactory.guidewire.com/api/npm/elixir/
npm-cli-login -u ${ARTIFACTORY_USERNAME} -p ${ARTIFACTORY_PASSWORD} -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/portfoliomunster-npm-dev -s @gtui
npm config set @gtui:registry https://artifactory.guidewire.com/api/npm/portfoliomunster-npm-dev/

# new Jutro proxy repo
npm-cli-login -u ${ARTIFACTORY_USERNAME} -p ${ARTIFACTORY_PASSWORD} -e doctools@guidewire.com -r https://artifactory.guidewire.com/api/npm/jutro-suite-npm-dev
npm config set registry https://artifactory.guidewire.com/api/npm/jutro-suite-npm-dev/