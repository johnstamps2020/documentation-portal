.PHONY: collect-documents load-index test-elastic-search test-landing-pages

PATH := $(PATH):$(HOME)/.poetry/bin

collect-documents:
	cd ./elastic_search/ \
        && poetry config virtualenvs.create false \
        && poetry install --no-dev \
        && cd .. \
        && python -m elastic_search.collect_documents

load-index:
	cd ./elastic_search/ \
		&& poetry config virtualenvs.create false \
		&& poetry install --no-dev \
		&& cd .. \
		&& python -m elastic_search.load_index

# An Elasticsearch instance is needed for test-load-index task. An http server instance is needed for test-collect-documents task.
# In TeamCity, the instances are built with a TeamCity plugin.
# If you have Docker Compose installed, you can use this task to create an Elasticsearch instance before running test-load-index locally.
create-test-environment:
	docker-compose -f ./tests/test_elastic_search/resources/docker-compose.yml up -d

test-collect-documents:
	export CONFIG_FILE=./tests/test_elastic_search/resources/input/config/gw-docs.json \
		&& export CRAWLER_START_URLS=http://localhost/ \
		&& export CRAWLER_ALLOWED_DOMAINS=localhost \
        && cd ./elastic_search/ \
        && poetry config virtualenvs.create false \
        && poetry install \
        && cd .. \
        && python -m pytest -v ./tests/test_elastic_search/test_collect_documents.py

test-load-index:
	export INDEXER_SEARCH_APP_URLS=localhost:9200 \
		&& export INDEXER_INDEX_NAME=gw-docs \
		&& export INDEXER_INDEX_FILE=./tests/test_elastic_search/resources/input/documents.json \
		&& export INDEXER_DOCUMENT_KEYS= \
        && cd ./elastic_search/ \
        && poetry config virtualenvs.create false \
        && poetry install \
        && cd .. \
        && python -m pytest -v ./tests/test_elastic_search/test_load_index.py