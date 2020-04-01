import ast
import json
import logging
import os
from pathlib import Path
from string import Template

import urllib3
from elasticsearch import Elasticsearch

search_app_urls = os.environ['INDEXER_SEARCH_APP_URLS'].split(' ')
document_keys = os.environ['INDEXER_DOCUMENT_KEYS'].split(' ')
index_name = os.environ['INDEXER_INDEX_NAME']
index_file = Path(os.environ['INDEXER_INDEX_FILE'])

# Fields of the keyword type are listed as filters on the search results page
main_index_settings = {
    "mappings": {
        "properties": {
            "id": {
                "type": "text",
                "analyzer": "keyword"
            },
            "platform": {
                "type": "keyword"
            },
            "product": {
                "type": "keyword"
            },
            "version": {
                "type": "keyword"
            },
        }
    }
}

elastic_del_query_template = Template("""{
    "query": {
        "regexp": {
            "id": {
                "value": "${path_to_delete}"
            }
        },
    }
}""")


class ElasticClient(Elasticsearch):
    def __init__(self, es_urls: list, **kwargs):
        super().__init__(es_urls, **kwargs)
        self.logger_instance = logging.getLogger(self.__str__())
        self.logger_instance.setLevel(logging.INFO)
        self.log_console_handler = logging.StreamHandler()
        self.log_console_handler.setLevel(logging.INFO)
        self.logger_instance.addHandler(self.log_console_handler)

    def create_index(self, search_index_name: str, search_index_settings: dict):
        if not self.indices.exists(index=search_index_name):
            self.logger_instance.info(f'Index "{search_index_name}" does not exist. Creating index.')
            operation_result = self.indices.create(index=search_index_name, body=search_index_settings)
            self.logger_instance.info(f'Index creation result: {operation_result}')
            return True
        else:
            self.logger_instance.info(f'Skipping index creation. Index "{search_index_name}" already exists.')
            return False

    @staticmethod
    def prepare_del_query(query_template: Template, **kwargs):
        return ast.literal_eval(query_template.substitute(**kwargs))

    def delete_entries_by_query(self, search_index_name: str, elastic_query: dict):
        if self.indices.exists(index=search_index_name):
            self.logger_instance.info(f'Index "{search_index_name}" exists.')
            self.logger_instance.info(f'Deleting entries for query: {elastic_query}')
            operation_result = self.delete_by_query(index=search_index_name, body=elastic_query)
            self.logger_instance.info(f'Deleted entries: {operation_result.get("deleted")}')
            return True
        else:
            self.logger_instance.info(f'Index "{search_index_name}" does not exist. No entries to delete.')
            return False

    def prepare_entries_from_file(self, search_index_file: Path()):
        with open(search_index_file, 'r') as file_data:
            index_entries = [json.loads(line) for line in file_data]
            self.logger_instance.info(
                f'Found {len(index_entries)} entries in {search_index_file.name} to load to the index')
        return index_entries

    def add_entries_to_index(self, search_index_name: str, entries: list):
        self.logger_instance.info(f'Adding entries to the {search_index_name} index...')
        number_of_created_entries = 0
        failed_entries = []
        for entry in entries:
            operation_result = self.index(index=search_index_name, body=entry)
            if operation_result.get('result') == 'created':
                number_of_created_entries += 1
            elif operation_result.get('result') != 'created':
                failed_entries.append(entry)
        self.logger_instance.info(f'\nCreated entries: {number_of_created_entries}')
        self.logger_instance.info(f'Failed entries: {len(failed_entries)}')
        if failed_entries:
            self.logger_instance.info(f'Failed to load the following entries:')
            for failed_entry in failed_entries:
                self.logger_instance.info(f'\t{failed_entry}')
            return False, number_of_created_entries, failed_entries
        return True, number_of_created_entries, failed_entries


if __name__ == '__main__':
    """ We turned off certificate validation in the Elasticsearch client because we don't need it.
    So when you connect to an https link, a warning is issued that your request is insecure.
    We turned off the warning as well.
    """
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    elastic_client = ElasticClient(search_app_urls, use_ssl=True, verify_certs=False, ssl_show_warn=False)

    for document_key in document_keys:
        elastic_del_query = elastic_client.prepare_del_query(elastic_del_query_template, path_to_delete=document_key)
        elastic_client.delete_entries_by_query(index_name, elastic_del_query)
    elastic_client.create_index(index_name, main_index_settings)
    elastic_client.add_entries_to_index(index_name, elastic_client.prepare_entries_from_file(index_file))
