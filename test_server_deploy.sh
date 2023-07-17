#!/bin/bash 

export TAG_VERSION=latest
export DEPT_CODE=284
export POD_NAME=doctools

# set +x
# docker login -u AWS -p $(aws ecr get-login-password) 627188849628.dkr.ecr.us-west-2.amazonaws.com
set -x
docker build -t 627188849628.dkr.ecr.us-west-2.amazonaws.com/tenant-doctools-docportal:latest . \
--build-arg TAG_VERSION \
--build-arg NPM_AUTH_TOKEN \
--build-arg DEPT_CODE \
--build-arg POD_NAME

# docker push 627188849628.dkr.ecr.us-west-2.amazonaws.com/tenant-doctools-docportal:latest

docker run --env-file ./server/.env -p 8081:8081 627188849628.dkr.ecr.us-west-2.amazonaws.com/tenant-doctools-docportal:latest