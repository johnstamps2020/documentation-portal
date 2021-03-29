import os
import logging
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
logger.info(f'Connecting to the search service: {"".join(search_app_urls)}')
client = Elasticsearch(search_app_urls, use_ssl=False, verify_certs=False,
                       ssl_show_warn=False)


def generate_sitemap():
    if output_file_path.exists():
        output_file_path.unlink()
    output_folder = output_file_path.parent
    if not output_folder.exists():
        logger.info(f'Creating output directory {output_folder}')
        output_folder.mkdir(parents=True)
    logger.info(f'Scanning the {index_name} index...')
    if client.indices.exists(index=index_name):
        resp = helpers.scan(client, index=index_name)
        count = 0
        indexed_docs = (indexed_doc for indexed_doc in resp)
        with open(output_file_path, 'a') as output_file:
            output_file.write('<?xml version="1.0" encoding="UTF-8"?>\n')
            output_file.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
            for doc in indexed_docs:
                output_file.write(f'<url>\n')
                url = doc['_source']['href']
                output_file.write(f'<loc><![CDATA[{url}?authSource=guidewire-customer]]></loc>\n')
                date = doc['_source'].get('indexed_date', None)
                if date:
                    output_file.write(f'<lastmod>{date}</lastmod>\n')
                output_file.write(f'</url>\n')
                count += 1
            output_file.write('</urlset>\n')
        logger.info(f'Processed {count} docs from {index_name}')


def main():
    generate_sitemap()


if __name__ == '__main__':
    main()
