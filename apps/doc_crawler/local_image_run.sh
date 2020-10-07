#!/bin/bash
set -xe

docker run -i \
-v /Users/pkowaluk/Documents/git-repos/documentation-portal/.teamcity/config:/config \
--env-file ./.env-file \
artifactory.guidewire.com/doctools-docker-dev/doc-crawler doc_crawler