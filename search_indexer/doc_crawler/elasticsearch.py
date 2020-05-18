import ast
import logging
from string import Template

from elasticsearch import Elasticsearch


class ElasticClient(Elasticsearch):
    elastic_del_query_template = Template("""{
            "query": {
                "match": {
                    "id": {
                        "query": "${path_to_delete}"
                        }
                    },
                }
            }""")

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
