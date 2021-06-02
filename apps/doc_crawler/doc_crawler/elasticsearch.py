import ast
import logging
from string import Template

from elasticsearch import Elasticsearch


class ElasticClient(Elasticsearch):
    elastic_del_query_template = Template("""{
            "query": {
                "match": {
                    "doc_id": {
                        "query": "${id_to_delete}"
                        }
                    },
                }
            }""")

    main_index_settings = {
        "settings": {
            "analysis": {
                "filter": {
                    "english_stemmer": {
                        "type": "stemmer",
                        "language": "english"
                    },
                    "english_possessive_stemmer": {
                        "type": "stemmer",
                        "language": "possessive_english"
                    }
                },
                "analyzer": {
                    "exact_match_analyzer": {
                        "type": "standard"
                    },
                    "general_match_analyzer": {
                        "tokenizer": "lowercase",
                        "filter": [
                            "english_stemmer",
                            "english_possessive_stemmer"
                        ]
                    }
                }
            }
        },
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
                "public": {
                    "type": "boolean"
                },
                "internal": {
                    "type": "boolean"
                },
                "body": {
                    "type": "text",
                    "analyzer": "general_match_analyzer",
                    "fields": {
                        "exact": {
                            "type": "text",
                            "analyzer": "exact_match_analyzer"
                        }
                    }
                },
                "title": {
                    "type": "text",
                    "analyzer": "general_match_analyzer",
                    "fields": {
                        "exact": {
                            "type": "text",
                            "analyzer": "exact_match_analyzer"
                        },
                        "raw": {
                            "type": "keyword"
                        }
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

    def create_index(self, search_index_name: str, search_index_settings: dict):
        operation_result = {}
        if not self.indices.exists(index=search_index_name):
            self.logger_instance.info(
                f'Index "{search_index_name}" does not exist. Creating index.')
            operation_result = self.indices.create(
                index=search_index_name, body=search_index_settings)
            self.logger_instance.info(
                f'Index creation result: {operation_result}')
        else:
            self.logger_instance.info(
                f'Skipping index creation. Index "{search_index_name}" already exists.')
        return operation_result

    @staticmethod
    def prepare_del_query(query_template: Template, **kwargs):
        return ast.literal_eval(query_template.substitute(**kwargs))

    def delete_entries_by_query(self, search_index_name: str, elastic_query: dict):
        operation_result = {}
        if self.indices.exists(index=search_index_name):
            self.logger_instance.info(
                f'{search_index_name}: Deleting entries for query: {elastic_query}')
            operation_result = self.delete_by_query(
                index=search_index_name, body=elastic_query)
            failed_entries = operation_result.get("failures")
            self.logger_instance.info(
                f'{search_index_name}: Deleted entries/Failures: {operation_result.get("deleted")}/{len(failed_entries)}')
            if failed_entries:
                self.logger_instance.warning(
                    f'Failed to load the following entries:')
                for failed_entry in failed_entries:
                    self.logger_instance.warning(f'\t{failed_entry}')
        else:
            self.logger_instance.info(
                f'Index "{search_index_name}" does not exist. No entries to delete.')

        return operation_result
