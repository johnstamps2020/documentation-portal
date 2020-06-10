import json
import os
import time
from pathlib import Path

import pytest
from lxml import etree
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings

from doc_crawler.elasticsearch import ElasticClient
from doc_crawler.spiders import doc_portal_spider

current_working_dir = Path.cwd()
current_dir = Path(__file__).parent
expected_resources = current_dir / 'resources' / 'expected'

config = os.environ.get('CONFIG_FILE')
app_base_url = os.environ.get('APP_BASE_URL')
doc_s3_url = os.environ.get('DOC_S3_URL')
elasticsearch_urls = os.environ.get('ELASTICSEARCH_URLS')
index_name = os.environ.get('INDEX_NAME')

doc_objects_to_crawl = doc_portal_spider.get_portal_config(config_file_path=config)

main_index_settings = ElasticClient.main_index_settings


def load_json_file(file_path: Path()):
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


def test_index_was_created(elastic_client):
    index_exists = elastic_client.indices.exists(index=index_name)
    assert index_exists is True


def test_index_has_entries(elastic_client):
    number_of_index_entries = elastic_client.count(index=index_name)['count']
    assert number_of_index_entries == 27


def test_delete_entries_by_query(elastic_client):
    entries_with_id_existed = False
    entries_with_id_deleted = False
    number_of_existing_eq_number_of_deleted = False

    elastic_del_query = elastic_client.prepare_del_query(elastic_client.elastic_del_query_template,
                                                         id_to_delete='isgwcpcloudlatest')

    search_doc_id_before_delete = elastic_client.search(index=index_name, body=elastic_del_query)
    number_of_existing_entries_before_delete = search_doc_id_before_delete['hits']['total']['value']

    if number_of_existing_entries_before_delete > 0:
        entries_with_id_existed = True

    delete_operation_result = elastic_client.delete_entries_by_query(index_name, elastic_del_query)
    number_of_deleted_entries = delete_operation_result.get('deleted')

    time.sleep(1)

    search_doc_id_after_delete = elastic_client.search(index=index_name, body=elastic_del_query)
    number_of_existing_entries_after_delete = search_doc_id_after_delete['hits']['total']['value']

    if number_of_existing_entries_after_delete == 0:
        entries_with_id_deleted = True

    if number_of_existing_entries_before_delete == number_of_deleted_entries:
        number_of_existing_eq_number_of_deleted = True

    assert entries_with_id_existed is True and entries_with_id_deleted is True and number_of_existing_eq_number_of_deleted is True


def test_broken_links_file():
    broken_links_file = current_working_dir / 'out' / 'broken-links-report.html'
    expected_broken_links_file = expected_resources / 'broken-links-report.html'

    html_parser = etree.HTMLParser()
    with open(broken_links_file) as brf:
        broken_links_file_tree = etree.parse(brf, html_parser)
        broken_links_table = broken_links_file_tree.find('//table')
        broken_links_table_string = etree.tostring(broken_links_table, pretty_print=True)
    with open(expected_broken_links_file) as ebrf:
        expected_broken_links_file_tree = etree.parse(ebrf, html_parser)
        expected_broken_links_table = expected_broken_links_file_tree.find('//table')
        expected_broken_links_table_string = etree.tostring(expected_broken_links_table, pretty_print=True)

    assert broken_links_table_string == expected_broken_links_table_string
