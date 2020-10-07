#!/usr/bin/env bash
set -xe

pip install poetry \
		&& poetry install --no-dev \
    && poetry run python -m doc_crawler.main