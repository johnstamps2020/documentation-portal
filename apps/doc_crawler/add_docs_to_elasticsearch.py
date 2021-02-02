import json
import os
import urllib3
from elasticsearch import helpers
from elasticsearch.exceptions import NotFoundError as ElasticNotFoundError
from pathlib import Path

from doc_crawler.elasticsearch import ElasticClient

current_dir = Path(__file__)
server_config_file = current_dir.parent / 'new-server-config.json'
# server_config_file = current_dir.parent.parent.parent / '.teamcity' / 'config' / 'server-config.json'

server_config_index_settings = {
    "settings": {
        "analysis": {
            "analyzer": {
                "default": {
                    "type": "keyword"
                }
            }
        }
    }
}

search_app_urls = os.environ.get('ELASTICSEARCH_URLS', None).split(' ')
index_name = 'server-config'
deploy_env = os.environ.get('DEPLOY_ENV', None)
""" We turned off certificate validation in the Elasticsearch client because we don't need it.
So when you connect to an https link, a warning is issued that your request is insecure.
We turned off the warning as well.
"""
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
elastic_client = ElasticClient(search_app_urls, use_ssl=False, verify_certs=False,
                               ssl_show_warn=False)

try:
    elastic_client.indices.delete(index=index_name)
except ElasticNotFoundError as e:
    elastic_client.logger_instance.info(f'Index {index_name} not found')

elastic_client.create_index(
    index_name, server_config_index_settings)

with server_config_file.open() as f:
    f_json = json.load(f)


def generate_data_for_indexing():
    docs = [doc for doc in f_json['docs']]
    for doc in docs:
        yield {
            "_index": index_name,
            "_source": doc,
        }


number_of_created_entries, failed_entries = helpers.bulk(elastic_client, generate_data_for_indexing())

elastic_client.logger_instance.info(
    f'\nCreated entries/Failures: {number_of_created_entries}/{len(failed_entries)}')
if failed_entries:
    elastic_client.logger_instance.info(
        f'Failed to load the following entries:')
    for failed_entry in failed_entries:
        elastic_client.logger_instance.info(f'\t{failed_entry}')
