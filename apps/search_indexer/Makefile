.PHONY: run-doc-crawler create-test-environment test-doc-crawler test-config

PATH := $(PATH):$(HOME)/.poetry/bin

run-doc-crawler:
	poetry install --no-dev \
        && poetry run python -m doc_crawler.main

# An Elasticsearch instance is needed for test-load-index task. An http server instance is needed for test-collect-documents task.
# In TeamCity, the instances are built with a TeamCity plugin.
# If you have Docker Compose installed, you can use this task to create an Elasticsearch instance before running
# test-collect-documents and test-load-index locally.
create-test-environment:
	export TEST_ENVIRONMENT_DOCKER_NETWORK=bridge \
		&& docker-compose -f ./tests/test_doc_crawler/resources/docker-compose.yml build \
		&& docker-compose -f ./tests/test_doc_crawler/resources/docker-compose.yml up -d

test-doc-crawler:
	export CONFIG_FILE=./tests/test_doc_crawler/resources/input/config/gw-docs.json \
		&& export APP_BASE_URL=http://localhost/ \
		&& export DOC_S3_URL=http://localhost/ \
		&& export ELASTICSEARCH_URLS=http://localhost:9200 \
		&& export INDEX_NAME=gw-docs \
        && poetry install \
        && poetry run python -m pytest -v ./tests/test_doc_crawler/test_doc_crawler.py

test-config:
	poetry install \
        && poetry run python -m pytest -vx ./tests/test_config/test_server_config.py