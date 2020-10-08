import json
import os

from elasticsearch import Elasticsearch, helpers

search_app_urls = os.environ.get('ELASTICSEARCH_URLS', None).split(' ')
path_to_config = os.environ.get('CONFIG_FILE', None)

print(f'Connecting to the search service: {"".join(search_app_urls)}')
client = Elasticsearch(search_app_urls, use_ssl=False, verify_certs=False,
                       ssl_show_warn=False)

print(f'Reading from config: {path_to_config}')
with open(path_to_config) as json_file:
    config_json = json.load(json_file)

searchable_ids_from_config = set([doc['id'] for doc in config_json['docs'] if doc.get('indexForSearch', True)])


def clean_index(index_name):
    print(f'Cleaning the {index_name} index...')
    if client.indices.exists(index=index_name):
        resp = helpers.scan(client, index=index_name)
        count = 0
        all_indexed_ids = set([indexed_doc['_source']['doc_id'] for indexed_doc in resp])
        for indexed_id in all_indexed_ids:
            if indexed_id not in searchable_ids_from_config:
                print(f'Deleting docs with id "{indexed_id}"')
                client.delete_by_query(index=index_name, body={
                    "query": {
                        "match": {
                            "doc_id": {
                                "query": indexed_id
                            }
                        },
                    }
                })
                count += 1
        print(f'Deleted {count} ids from {index_name}')


clean_index('gw-docs')
clean_index('broken-links')
