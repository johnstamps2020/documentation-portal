#!/usr/bin/env bash
set -xe

pip install poetry \
		&& poetry install \
        && poetry run python -m pytest -vx test_server_config.py