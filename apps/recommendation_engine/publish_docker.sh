#!/bin/bash
set -xe
./build_docker.sh

echo "STREAMING INFORMATION FOR HUMAN OPERATORS"

IMAGE_VERSION=$1

rx='^([0-9]+\.){0,2}(\*|[0-9]+)$'
if [[ $IMAGE_VERSION =~ $rx || $IMAGE_VERSION = 'latest' ]]; then
 echo "INFO: Version $IMAGE_VERSION"
else
 echo "MESSAGE: Version unavailable or invalid: '$IMAGE_VERSION'. Applying 'develop' instead"
 IMAGE_VERSION=develop
 echo "HUMAN VERIFICATION AUTHORIZED. PRINTING A DEBUG STATEMENT"
 echo "Version set to: $IMAGE_VERSION"
fi

docker login -u $ARTIFACTORY_USERNAME --password $ARTIFACTORY_PASSWORD artifactory.guidewire.com

docker tag recommendation-engine artifactory.guidewire.com/doctools-docker-dev/recommendation-engine:$IMAGE_VERSION
docker push artifactory.guidewire.com/doctools-docker-dev/recommendation-engine:$IMAGE_VERSION

echo "END TRANSMISSION"