#!/usr/bin/env bash
set -xe

export CONFIG_FILE=./tests/test_doc_crawler/resources/input/config/gw-docs.json \
		&& export APP_BASE_URL=http://localhost/ \
		&& export DOC_S3_URL=http://localhost/ \
		&& export ELASTICSEARCH_URLS=http://localhost:9200 \
		&& export DOCS_INDEX_NAME=gw-docs \
		&& export BROKEN_LINKS_INDEX_NAME=broken-links \
		&& export SHORT_TOPICS_INDEX_NAME=short-topics \
		&& export REPORT_BROKEN_LINKS=yes \
		&& export REPORT_SHORT_TOPICS=yes \
		&& apt-get update && apt-get install -y build-essential \
		&& pip install poetry \
        && poetry install \
        && poetry run python -m pytest -v ./tests/test_doc_crawler/test_doc_crawler.py