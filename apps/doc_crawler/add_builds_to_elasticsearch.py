import json
import os
from pathlib import Path
from elasticsearch.exceptions import NotFoundError as ElasticNotFoundError

import urllib3

from doc_crawler.elasticsearch import ElasticClient

current_dir = Path(__file__)
builds_config_file = current_dir.parent.parent.parent / '.teamcity' / 'config' / 'builds.json'
builds_config_index_settings = {
    "mappings": {
        "properties": {
            "buildType": {"type": "text"},
            "filter": {"type": "text"},
            "root": {"type": "text"},
            "srcId": {"type": "text"},
            "docId": {"type": "text"},
            "resources": {
                "properties": {
                    "sourceFolder": {"type": "text"},
                    "targetFolder": {"type": "text"},
                    "srcId": {"type": "text"},
                }},
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
index_name = 'builds-config'
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
    index_name, builds_config_index_settings)

with builds_config_file.open() as f:
    f_json = json.load(f)
builds = f_json['builds']

number_of_created_entries = 0
failed_entries = []
for build in builds:
    create_operation_result = elastic_client.index(
        index=index_name, body=build)
    if create_operation_result.get('result') == 'created':
        number_of_created_entries += 1
    elif create_operation_result.get('result') != 'created':
        failed_entries.append(build)

elastic_client.logger_instance.info(
    f'\nCreated entries/Failures: {number_of_created_entries}/{len(failed_entries)}')
if failed_entries:
    elastic_client.logger_instance.info(
        f'Failed to load the following entries:')
    for failed_entry in failed_entries:
        elastic_client.logger_instance.info(f'\t{failed_entry}')
