import json
import os
import time
from pathlib import Path

import pytest
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





def test_broken_links_file():
    broken_links_file = current_working_dir / 'out' / 'broken-links.json'
    expected_broken_links_file = expected_resources / 'broken-links.json'

    broken_links = load_json_file(broken_links_file)
    expected_broken_links = load_json_file(expected_broken_links_file)

    broken_links_match = True
    for expected_broken_link in expected_broken_links:
        matching_broken_link = next(
            broken_link for broken_link in broken_links if broken_link['doc_id'] == expected_broken_link['doc_id'])
        if matching_broken_link != expected_broken_link:
            broken_links_match = False

    if len(broken_links) != len(expected_broken_links):
        broken_links_match = False

    assert broken_links_match is True
