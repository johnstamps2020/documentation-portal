import json
import os
from pathlib import Path

import pytest
import time
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings

from doc_crawler.elastic_client import ElasticClient
from doc_crawler.spiders import doc_portal_spider

current_working_dir = Path.cwd()
current_dir = Path(__file__).parent
expected_resources = current_dir / 'resources' / 'expected'

config = os.environ['CONFIG_FILE']
app_base_url = os.environ['APP_BASE_URL']
doc_s3_url = os.environ['DOC_S3_URL']
elasticsearch_urls = os.environ['ELASTICSEARCH_URLS'].split(' ')
docs_index_name = os.environ['DOCS_INDEX_NAME']
broken_links_index_name = os.environ['BROKEN_LINKS_INDEX_NAME']
short_topics_index_name = os.environ['SHORT_TOPICS_INDEX_NAME']

doc_objects_to_crawl = doc_portal_spider.get_portal_config(
    config_file_path=config)

main_index_settings = ElasticClient.main_index_settings


def load_json_file(file_path: Path):
    with open(file_path, 'r') as f:
        return [json.loads(line) for line in f]


@pytest.fixture(scope='session')
def elastic_client():
    try:
        return ElasticClient(
            elasticsearch_urls,
            use_ssl=False,
            verify_certs=False,
            ssl_show_warn=False)
    except Exception as e:
        print(e)


@pytest.fixture(scope='session', autouse=True)
def doc_crawler():
    process = CrawlerProcess(get_project_settings())
    process.crawl(doc_portal_spider.DocPortalSpider, docs=doc_objects_to_crawl, app_base_url=app_base_url,
                  doc_s3_url=doc_s3_url)
    process.start()
    time.sleep(5)
    yield


def test_normalize_text():
    input_text = ' This is   some text with \n unneeded whitespace characters\r. It will become \t nice after cleaning. '
    normalized_text = doc_portal_spider.normalize_text(input_text)
    expected_text = 'This is some text with unneeded whitespace characters. It will become nice after cleaning.'
    assert normalized_text == expected_text


@pytest.mark.parametrize('index_name', [docs_index_name, broken_links_index_name, short_topics_index_name])
def test_index_was_created(elastic_client, index_name):
    index_exists = elastic_client.indices.exists(index=index_name)
    assert index_exists is True


@pytest.mark.parametrize("index_name,expected_number_of_entries",
                         [(docs_index_name, 157), (broken_links_index_name, 3), (short_topics_index_name, 34)])
def test_index_has_entries(elastic_client, index_name, expected_number_of_entries):
    number_of_index_entries = elastic_client.count(index=index_name)['count']
    assert number_of_index_entries == expected_number_of_entries


def test_topic_has_internal_property(elastic_client):
    search_results_not_internal = elastic_client.search(index=docs_index_name, query={
        "match": {
            "id": "/isconfigupgradetools/320/topics/c_error-log-files.html"
        }
    })
    found_not_internal_doc = search_results_not_internal['hits']['hits'][0]['_source']
    assert found_not_internal_doc['internal'] is False

    search_results_internal = elastic_client.search(index=docs_index_name, query={
        "match": {
            "id": "/isconfigupgradetools/draft/topics/r_smart-diff-commands.html"
        }
    })
    found_internal_doc = search_results_internal['hits']['hits'][0]['_source']
    assert found_internal_doc['internal'] is True


def test_exact_match(elastic_client):
    def prepare_search_query(search_phrase: str, quoted_phrase: bool):
        if quoted_phrase:
            search_phrase = f"\"{search_phrase}\""
        return {
            "bool": {
                "must": {
                    "simple_query_string": {
                        "query": search_phrase,
                        "fields": ["title^12", "body"],
                        "quote_field_suffix": ".exact",
                        "default_operator": "AND",
                    },
                },
            }
        }

    def test_matches_exist():
        search_string = 'configuring merge tracker'
        search_results = elastic_client.search(index=docs_index_name,
                                               query=prepare_search_query(search_string, True))

        assert search_results['hits']['total']['value'] == 19
        found_docs = (hit['_source'] for hit in search_results['hits']['hits'])
        for doc in found_docs:
            assert search_string.casefold() in doc['body'].casefold()

    def test_matches_do_not_exist():
        search_string = 'configure merge tracker'
        no_search_results = elastic_client.search(index=docs_index_name,
                                                  query=prepare_search_query(search_string, True))
        assert no_search_results['hits']['total']['value'] == 0

    def test_number_of_matches():
        search_string = 'upgrade.steps.general.pl.TransformDocumentUpgradeStep'
        exact_match_search_results = elastic_client.search(index=docs_index_name,
                                                           query=prepare_search_query(search_string, True))
        regular_match_search_results = elastic_client.search(index=docs_index_name,
                                                             query=prepare_search_query(search_string, False))

        assert regular_match_search_results['hits']['total']['value'] > exact_match_search_results['hits']['total'][
            'value'] == 0

    test_matches_exist()
    test_matches_do_not_exist()
    test_number_of_matches()


def test_delete_entries_by_query(elastic_client):
    elastic_del_query = elastic_client.prepare_del_query(elastic_client.elastic_del_query_template,
                                                         id_to_delete='isconfigupgradetools320')

    search_doc_id_before_delete = elastic_client.search(
        index=docs_index_name, body=elastic_del_query)
    number_of_existing_entries_before_delete = search_doc_id_before_delete[
        'hits']['total']['value']

    entries_with_id_existed = number_of_existing_entries_before_delete > 0
    delete_operation_result = elastic_client.delete_entries_by_query(
        docs_index_name, elastic_del_query)
    number_of_deleted_entries = delete_operation_result.get('deleted')

    time.sleep(1)

    search_doc_id_after_delete = elastic_client.search(
        index=docs_index_name, body=elastic_del_query)
    number_of_existing_entries_after_delete = search_doc_id_after_delete['hits']['total']['value']

    entries_with_id_deleted = number_of_existing_entries_after_delete == 0
    number_of_existing_eq_number_of_deleted = (
            number_of_existing_entries_before_delete == number_of_deleted_entries
    )

    assert (
            entries_with_id_existed
            and entries_with_id_deleted
            and number_of_existing_eq_number_of_deleted
    )
