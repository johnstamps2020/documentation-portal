#!/usr/bin/env bash
set -xe

# An Elasticsearch instance is needed for test-load-index task. An http server instance is needed for test-collect-documents task.
# In TeamCity, the instances are built with a TeamCity plugin.
# If you have Docker Compose installed, you can use this task to create an Elasticsearch instance before running
# test-collect-documents and test-load-index locally.
export TEST_ENVIRONMENT_DOCKER_NETWORK=bridge \
  && docker-compose -f ./resources/docker-compose.yml build --no-cache \
  && docker-compose -f ./resources/docker-compose.yml up -d
