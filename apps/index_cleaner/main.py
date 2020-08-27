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

ids_in_config = []
for doc in config_json['docs']:
    doc_id = doc.get('id', None)
    if (doc_id and doc_id not in ids_in_config):
        ids_in_config.append(doc_id)


def clean_index(index_name):
    print(f'Cleaning the {index_name} index...')
    if client.indices.exists(index=index_name):
        search_body = {
            "size": 42,
            "query": {
                "match_all": {}
            }
        }
        all_ids = []

        resp = helpers.scan(client, index=index_name)
        for doc in list(resp):
            doc_id = doc['_source'].get('doc_id', None)
            if (doc_id and doc_id not in all_ids):
                all_ids.append(doc_id)

        count = 0
        for id_in_index in all_ids:
            if id_in_index not in ids_in_config:
                print(f'Deleting docs with id "{id_in_index}"')
                client.delete_by_query(index=index_name, body={
                    "query": {
                        "match": {
                            "doc_id": {
                                "query": id_in_index
                            }
                        },
                    }
                })
                count += 1
        print(f'Deleted {count} ids from {index_name}')


clean_index('gw-docs')
clean_index('broken-links')
