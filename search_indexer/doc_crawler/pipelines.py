import ast
import json
import logging
import os
from pathlib import Path
from string import Template

import urllib3
from elasticsearch import Elasticsearch

from .items import BrokenLink
from .items import IndexEntry


class ElasticClient(Elasticsearch):
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


class BrokenLinkPipeline:
    current_working_dir = Path.cwd()
    out_dir = current_working_dir / 'out'
    broken_links_file = None

    def open_spider(self, spider):
        self.out_dir.mkdir(exist_ok=True)
        self.broken_links_file = open(self.out_dir / 'broken-links.json', 'w')

    def close_spider(self, spider):
        self.broken_links_file.close()

    def process_item(self, item, spider):
        if item.__class__.__name__ == BrokenLink.__name__:
            broken_link_item = dict(item)
            line = f'{json.dumps(broken_link_item)}\n'
            self.broken_links_file.write(line)

        return item


class ElasticsearchPipeline:
    elastic_del_query_template = Template("""{
            "query": {
                "match": {
                    "id": {
                        "query": "${path_to_delete}"
                        }
                    },
                }
            }""")

    elastic_client = None
    index_name = ''
    number_of_created_entries = 0
    failed_entries = []

    def open_spider(self, spider):

        search_app_urls = os.environ.get('ELASTICSEARCH_URLS', None).split(' ')
        self.index_name = os.environ.get('INDEX_NAME', None)
        """ We turned off certificate validation in the Elasticsearch client because we don't need it.
        So when you connect to an https link, a warning is issued that your request is insecure.
        We turned off the warning as well.
        """
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
        self.elastic_client = ElasticClient(search_app_urls, use_ssl=False, verify_certs=False,
                                            ssl_show_warn=False)
        self.elastic_client.create_index(self.index_name, self.elastic_client.main_index_settings)

    def close_spider(self, spider):
        self.elastic_client.logger_instance.info(f'\nCreated entries: {self.number_of_created_entries}')
        self.elastic_client.logger_instance.info(f'Failed entries: {len(self.failed_entries)}')
        if self.failed_entries:
            self.elastic_client.logger_instance.info(f'Failed to load the following entries:')
            for failed_entry in self.failed_entries:
                self.elastic_client.logger_instance.info(f'\t{failed_entry}')

    def process_item(self, item, spider):
        if item.__class__.__name__ == IndexEntry.__name__:
            index_entry = dict(item)
            elastic_del_query = self.elastic_client.prepare_del_query(self.elastic_del_query_template,
                                                                      path_to_delete=index_entry['id'])
            self.elastic_client.logger_instance.info(f'Deleting entry using query: {elastic_del_query}')
            del_operation_result = self.elastic_client.delete_by_query(index=self.index_name, body=elastic_del_query)
            if del_operation_result.get("failures"):
                self.elastic_client.logger_instance.warning('Failed to delete entry')
            else:
                self.elastic_client.logger_instance.info('Entry deleted')

            create_operation_result = self.elastic_client.index(index=self.index_name, body=index_entry)
            if create_operation_result.get('result') == 'created':
                self.number_of_created_entries += 1
            elif create_operation_result.get('result') != 'created':
                self.failed_entries.append(index_entry)

        return item
