import json
import sys
import os
from elasticsearch import Elasticsearch, helpers

docsearch_url = f'https://docsearch-doctools.{os.environ["DEPLOY_ENV"]}.ccs.guidewire.net'
if os.environ["DEPLOY_ENV"] == 'prod':
    docsearch_url = 'https://docsearch-doctools.internal.us-east-2.service.guidewire.net'

print(f'Connecting to the search service: {docsearch_url}')
client = Elasticsearch([docsearch_url], use_ssl=False, verify_certs=False,
                       ssl_show_warn=False)

path_to_config = sys.argv[1]
print(f'Reading from config: {path_to_config}')
with open(path_to_config) as json_file:
    config_json = json.load(json_file)

ids_in_config = []
for doc in config_json['docs']:
    doc_id = doc.get('id', None)
    if (doc_id and doc_id not in ids_in_config):
        ids_in_config.append(doc_id)

index_name = 'gw-docs'


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
    print(f'Deleted {count} ids')
