import ast
import logging
from string import Template

from elasticsearch import Elasticsearch


class ElasticClient(Elasticsearch):
    elastic_del_query_template = Template("""{
            "query": {
                "match": {
                    "id": {
                        "query": "${id_to_delete}"
                        }
                    },
                }
            }""")

    main_index_settings = {
        "mappings": {
            "properties": {
                "doc_id": {
                    "type": "text",
                    "analyzer": "keyword"
                },
                "id": {
                    "type": "text",
                    "analyzer": "keyword"
                },
                "title": {
                    "type": "text",
                },
                "recommendations": {
                    "properties": {
                        "title": {"type": "text"},
                        "relative_url": {
                            "type": "text",
                            "analyzer": "keyword"
                        },
                    }
                }
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

    def create_index(self, index_name: str, index_settings: dict):
        operation_result = {}
        if not self.indices.exists(index=index_name):
            self.logger_instance.info(
                f'Index "{index_name}" does not exist. Creating index.')
            operation_result = self.indices.create(
                index=index_name, body=index_settings)
            self.logger_instance.info(
                f'Index creation result: {operation_result}')
        else:
            self.logger_instance.info(
                f'Skipping index creation. Index "{index_name}" already exists.')
        return operation_result

    def create_entry(self, index_name: str, index_entry: dict):
        self.logger_instance.info(f'Creating entry for: {index_entry["id"]}')
        response = self.index(
            index=index_name,
            document=index_entry)
        operation_result = response.get('result')
        if operation_result == 'created':
            self.logger_instance.info('\tResult: CREATED')
            return True
        else:
            self.logger_instance.error('\tResult: FAILED TO CREATE')
            return False

    def delete_entry_by_query(self, index_name: str, **kwargs):
        elastic_query = ast.literal_eval(self.elastic_del_query_template.substitute(**kwargs))
        self.logger_instance.info(
            f'Deleting entry for query: {elastic_query}')
        response = self.delete_by_query(
            index=index_name,
            body=elastic_query)
        failed_entries = response.get("failures")
        self.logger_instance.info(
            f'Deleted entries/Failures: {response.get("deleted")}/{len(failed_entries)}')
        if failed_entries:
            self.logger_instance.error('Failed to delete the following entries:')
            self.logger_instance.error('\t\t'.join(failed_entries))
