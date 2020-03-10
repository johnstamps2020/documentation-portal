import os
import sys
from pathlib import Path

local_modules_path = os.path.abspath(Path(__file__).parent.parent.parent)
sys.path.insert(0, local_modules_path)

import elastic_search.load_index as indexer
import pytest

search_app_urls = indexer.search_app_urls
document_keys = indexer.document_keys
index_name = indexer.index_name
index_file = indexer.index_file
index_settings = indexer.main_index_settings
delete_query_template = indexer.elastic_del_query_template


@pytest.fixture(scope='module')
def elastic_client():
    try:
        return indexer.ElasticClient(
            search_app_urls,
            use_ssl=False,
            verify_certs=False,
            ssl_show_warn=False)
    except Exception as e:
        print(e)


def test_create_index(elastic_client):
    index_exists = elastic_client.indices.exists(index_name)
    elastic_client.logger_instance.info(index_exists)
    if index_exists:
        assert elastic_client.create_index(index_name, index_settings) is False
    elif not index_exists:
        assert elastic_client.create_index(index_name, index_settings) is True


def test_delete_entries_by_query(elastic_client):
    for document_key in document_keys:
        elastic_del_query = elastic_client.prepare_del_query(delete_query_template, path_to_delete=document_key)
        doc_count = elastic_client.count(index=index_name, body=elastic_del_query)
        if doc_count == 0:
            assert elastic_client.delete_entries_by_query(index_name, elastic_del_query) is False
        else:
            assert elastic_client.delete_entries_by_query(index_name, elastic_del_query) is True


def test_add_entries_to_index(elastic_client):
    index_entries_to_load = elastic_client.prepare_entries_from_file(index_file)
    operation_result, number_of_created_entries, failed_entries = elastic_client.add_entries_to_index(index_name,
                                                                                                      index_entries_to_load)
    if operation_result is True:
        assert len(index_entries_to_load) == number_of_created_entries
    elif operation_result is False:
        assert len(failed_entries) > 0
