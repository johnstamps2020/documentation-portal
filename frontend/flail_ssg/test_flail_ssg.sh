#!/usr/bin/env bash
set -xe

cp ../page-schema.json flail_ssg/
pip install poetry &&
  poetry install &&
  poetry run python -m pytest -vx tests/
