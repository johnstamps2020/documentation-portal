import os
import logging
import json
import shutil
from pathlib import Path

from elasticsearch import Elasticsearch, helpers

index_name = 'gw-docs'
search_app_urls = os.environ['ELASTICSEARCH_URLS'].split(' ')
output_file_path = Path(os.environ['OUTPUT_FILE'])

logger = logging.getLogger(__file__)
logger.setLevel(logging.INFO)
ch = logging.StreamHandler()
ch.setLevel(logging.INFO)
logger.addHandler(ch)


def escape_entities(text_to_convert: str):
    conversion_map = {
        '&': '&amp;',
        "'": '&apos;',
        '"': '&quot;',
        '>': '&gt;',
        '<': '&lt;'
    }
    for key, value in conversion_map.items():
        text_to_convert = text_to_convert.replace(key, value)
    return text_to_convert


def get_indexed_docs():
    index_source = os.environ.get('INDEX_SOURCE', None)
    if index_source:
        logger.info(f'Reading local index file: {index_source}')
        with open(index_source) as local_index_file:
            local_index_json = json.load(local_index_file)
            return local_index_json
    else:
        logger.info(
            f'Connecting to the search service: {"".join(search_app_urls)}')
        client = Elasticsearch(search_app_urls,
                               use_ssl=False, verify_certs=False,
                               ssl_show_warn=False)
        if client.indices.exists(index=index_name):
            logger.info(f'Scanning the {index_name} index...')
            resp = helpers.scan(client, index=index_name)
            return [indexed_doc for indexed_doc in resp]


def generate_sitemap():
    output_folder = output_file_path.parent
    if output_folder.exists:
        logger.info(
            f'Deleting the pre-existing output directory {output_folder}')
        shutil.rmtree(output_folder)
    if not output_folder.exists():
        logger.info(f'Creating output directory {output_folder}')
        output_folder.mkdir(parents=True)
    count = 0
    indexed_docs = get_indexed_docs()
    with open(output_file_path, 'a') as output_index_file:
        output_index_file.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        output_index_file.write(
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for doc in indexed_docs:
            output_index_file.write('<url>\n')
            url = doc['_source']['href']
            output_index_file.write(f'<loc>{escape_entities(url)}</loc>\n')
            date = doc['_source'].get('indexed_date', None)
            if date:
                output_index_file.write(f'<lastmod>{date}</lastmod>\n')
            output_index_file.write('</url>\n')
            count += 1
        output_index_file.write('</urlset>\n')
    logger.info(f'Processed {count} docs from {index_name}')


def main():
    generate_sitemap()


if __name__ == '__main__':
    main()
