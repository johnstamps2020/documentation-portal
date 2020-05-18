import json
import os
from pathlib import Path
from urllib.parse import urljoin, urlparse

import urllib3

from .elasticsearch import ElasticClient
from .items import BrokenLink
from .items import IndexEntry


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

        for doc in spider.docs:
            id_to_delete = f'{urlparse(urljoin(spider.doc_s3_url, doc["url"])).path}.*'
            elastic_del_query = self.elastic_client.prepare_del_query(self.elastic_client.elastic_del_query_template,
                                                                      id_to_delete=id_to_delete)
            self.elastic_client.delete_entries_by_query(self.index_name, elastic_del_query)

    def close_spider(self, spider):
        self.elastic_client.logger_instance.info(
            f'\nCreated entries/Failures: {self.number_of_created_entries}/{len(self.failed_entries)}')
        if self.failed_entries:
            self.elastic_client.logger_instance.info(f'Failed to load the following entries:')
            for failed_entry in self.failed_entries:
                self.elastic_client.logger_instance.info(f'\t{failed_entry}')

    def process_item(self, item, spider):
        if item.__class__.__name__ == IndexEntry.__name__:
            index_entry = dict(item)
            create_operation_result = self.elastic_client.index(index=self.index_name, body=index_entry)
            if create_operation_result.get('result') == 'created':
                self.number_of_created_entries += 1
            elif create_operation_result.get('result') != 'created':
                self.failed_entries.append(index_entry)

        return item
