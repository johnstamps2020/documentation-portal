#!/usr/bin/env bash
set -xe

export CONFIG_FILE=./tests/test_doc_crawler/resources/input/config/gw-docs.json \
		&& export APP_BASE_URL=http://localhost/ \
		&& export DOC_S3_URL=http://localhost/ \
		&& export ELASTICSEARCH_URLS=http://localhost:9200 \
		&& export INDEX_NAME=gw-docs \
		&& pip install poetry \
        && poetry install \
        && poetry run python -m pytest -v ./tests/test_doc_crawler/test_doc_crawler.py