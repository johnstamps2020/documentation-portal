import os
import logging
import json
import shutil
import semver
from pathlib import Path

from elasticsearch import Elasticsearch, helpers

index_name = 'gw-docs'
search_app_urls = os.environ['ELASTICSEARCH_URLS'].split(' ')
output_dir = Path(os.environ['OUTPUT_DIR'])
app_base_url = os.environ['APP_BASE_URL']

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


def is_not_old_insurance_suite(doc):
    product = doc['_source'].get('product')
    version = doc['_source'].get('version')
    if product and version:
        insurance_suite_products = [
            'PolicyCenter', 'ClaimCenter', 'BillingCenter']
        if any(item in product for item in insurance_suite_products):
            for ver in version:
                if semver.compare(ver, '8.0.0') >= 0:
                    return True
            return False
    else:
        return True


def get_indexed_docs():
    index_source = os.environ.get('INDEX_SOURCE', None)
    all_docs = None
    if index_source:
        logger.info(f'Reading local index file: {index_source}')
        with open(index_source) as local_index_file:
            local_index_json = json.load(local_index_file)
            all_docs = local_index_json
    else:
        logger.info(
            f'Connecting to the search service: {"".join(search_app_urls)}')
        client = Elasticsearch(search_app_urls,
                               use_ssl=False, verify_certs=False,
                               ssl_show_warn=False)
        if client.indices.exists(index=index_name):
            logger.info(f'Scanning the {index_name} index...')
            resp = helpers.scan(client, index=index_name)
            all_docs = list(indexed_doc for indexed_doc in resp)
    filtered_docs = list(filter(is_not_old_insurance_suite, all_docs))
    return filtered_docs


def write_docs_to_sitemap(sitemap_path, docs):
    latest_date = None
    with open(sitemap_path, 'a') as output_sitemap_file:
        output_sitemap_file.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        output_sitemap_file.write(
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for doc in docs:
            output_sitemap_file.write('<url>\n')
            url = doc['_source']['href']
            output_sitemap_file.write(f'<loc>{escape_entities(url)}</loc>\n')
            date = doc['_source']['indexed_date']
            if not latest_date:
                latest_date = date
            else:
                if date > latest_date:
                    latest_date = date
            output_sitemap_file.write(f'<lastmod>{date}</lastmod>\n')
            output_sitemap_file.write('</url>\n')
        output_sitemap_file.write('</urlset>\n')
    return latest_date


def get_chunks(lst, length):
    for i in range(0, len(lst), length):
        yield lst[i:i + length]


def generate_sitemap():
    if output_dir.exists():
        logger.info(
            f'Deleting the pre-existing output directory {output_dir}')
        shutil.rmtree(output_dir)
    logger.info(f'Creating a fresh output directory {output_dir}')
    output_dir.mkdir(parents=True)
    indexed_docs = get_indexed_docs()
    with open(output_dir / 'sitemap.xml', 'a') as output_index_file:
        output_index_file.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        output_index_file.write(
            '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        chunks = get_chunks(indexed_docs, 49999)
        for index, chunk in enumerate(chunks):
            chunk_file_name = f'sitemap{index}.xml'
            chunk_file_path = output_dir / chunk_file_name
            date = write_docs_to_sitemap(chunk_file_path, chunk)
            output_index_file.write('<sitemap>\n')
            output_index_file.write(
                f'<loc>{escape_entities(f"{app_base_url}/{chunk_file_name}")}</loc>\n')
            if date:
                output_index_file.write(f'<lastmod>{date}</lastmod>\n')
            output_index_file.write('</sitemap>\n')
        output_index_file.write('</sitemapindex>\n')

    logger.info(f'Processed all docs from {index_name}')


def main():
    generate_sitemap()


if __name__ == '__main__':
    main()
