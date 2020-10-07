import os

from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings

from search_indexer.doc_crawler.spiders import doc_portal_spider


def env_is_set():
    env_list = ['CONFIG_FILE', 'APP_BASE_URL',
                'DOC_S3_URL', 'ELASTICSEARCH_URLS', 'INDEX_NAME']
    for env_name in env_list:
        if env_name not in os.environ:
            print(
                f'Environment variable {env_name} is not set. Required variables: {env_list}')
            return False
    return True


def main():
    if not env_is_set():
        return
    config_file = os.environ.get('CONFIG_FILE', None)
    # TODO: Convert the DOC_ID to a more flexible mechanism that allows us to filter the list of doc objects in different ways.
    # TODO: For example if we want to run a crawler for portal2 docs, we could provide a query with a regular expression.
    doc_id = os.environ.get('DOC_ID', None)
    # TODO: Move the s3 url and app base url to the config file
    app_base_url = os.environ.get('APP_BASE_URL', None)
    doc_s3_url = os.environ.get('DOC_S3_URL', None)
    docs_in_config = doc_portal_spider.get_portal_config(config_file)
    doc_objects_to_crawl = []
    if doc_id:
        doc_objects_to_crawl = [
            doc_object for doc_object in docs_in_config if doc_object.get('id') == doc_id]
    else:
        doc_objects_to_crawl = docs_in_config

    if not doc_objects_to_crawl:
        raise ValueError('The list of docs to crawl is empty. Possible reasons:'
                         '\n\t- The config file does not contain any docs.'
                         '\n\t- The provided doc ID is invalid.')

    process = CrawlerProcess(get_project_settings())
    process.crawl(doc_portal_spider.DocPortalSpider, docs=doc_objects_to_crawl, app_base_url=app_base_url,
                  doc_s3_url=doc_s3_url)
    process.start()


if __name__ == '__main__':
    main()
