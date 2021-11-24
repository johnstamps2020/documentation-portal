#!/bin/bash
set -xe
cp ../page-schema.json flail_ssg/
docker image build --no-cache -t flail-ssg .