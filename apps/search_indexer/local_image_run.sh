#!/bin/bash
set -xe

# ./build_docker.sh

docker run -i \
-v /Users/pkowaluk/Documents/git-repos/documentation-portal/.teamcity/config:/config \
--env-file ./.env-file \
search-indexer search_indexer