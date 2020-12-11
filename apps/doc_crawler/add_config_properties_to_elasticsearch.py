import json
import os
from pathlib import Path

import urllib3
from elasticsearch.exceptions import NotFoundError as ElasticNotFoundError

from doc_crawler.elasticsearch import ElasticClient

current_dir = Path(__file__)
config_properties_file = current_dir.parent.parent.parent / '.teamcity' / 'config' / 'config-properties.json'
config_properties_index_settings = {
    "mappings": {
        "properties": {
            "name": {"type": "text"},
            "values": {"type": "text"}
        }
    },
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
index_name = 'config-properties'
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
    index_name, config_properties_index_settings)

with config_properties_file.open() as f:
    f_json = json.load(f)
config_properties = f_json['configProperties']

number_of_created_entries = 0
failed_entries = []
for prop in config_properties:
    create_operation_result = elastic_client.index(
        index=index_name, body=prop)
    if create_operation_result.get('result') == 'created':
        number_of_created_entries += 1
    elif create_operation_result.get('result') != 'created':
        failed_entries.append(prop)

elastic_client.logger_instance.info(
    f'\nCreated entries/Failures: {number_of_created_entries}/{len(failed_entries)}')
if failed_entries:
    elastic_client.logger_instance.info(
        f'Failed to load the following entries:')
    for failed_entry in failed_entries:
        elastic_client.logger_instance.info(f'\t{failed_entry}')
