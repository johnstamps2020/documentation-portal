#!/usr/bin/env bash
set -xe

pip install poetry \
    && poetry install \
    && poetry run python -m pytest -v ./tests/test_config_deployer.py