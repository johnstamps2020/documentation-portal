#!/usr/bin/env bash
set -xe

pip install poetry &&
  poetry install &&
  poetry run python -m pytest -vx tests/
