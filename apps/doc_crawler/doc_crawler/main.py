from multiprocessing import Process, Queue

import os
import sys
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from typing import List

from doc_crawler.spiders import doc_portal_spider


def create_crawler_process(spider, docs_to_crawl: List, root_url: str, s3_bucket_url: str, q):
    try:
        crawler_settings = get_project_settings()
        crawler_settings.set('LOG_FILE', f'doc_crawler_{docs_to_crawl[0]["id"]}.log')
        process = CrawlerProcess(crawler_settings)
        process.crawl(spider, docs=docs_to_crawl, app_base_url=root_url,
                      doc_s3_url=s3_bucket_url)
        process.start()
        q.put(None)
    except Exception as e:
        q.put(e)


def run_spider(spider, docs_to_crawl: List, root_url: str, s3_bucket_url: str):
    queue = Queue()
    process = Process(target=create_crawler_process, args=(spider, docs_to_crawl, root_url, s3_bucket_url, queue,))
    process.start()
    result = queue.get()
    process.join()

    if result is not None:
        raise result


def env_is_set():
    env_list = ['CONFIG_FILE', 'APP_BASE_URL',
                'DOC_S3_URL', 'ELASTICSEARCH_URLS', 'INDEX_NAME']
    for env_name in env_list:
        if env_name not in os.environ:
            print(
                f'Environment variable {env_name} is not set. Required variables: {env_list}')
            return False
        else:
            print(f'{env_name}: {os.environ[env_name]}')
    return True


def main():
    if not env_is_set():
        sys.exit(1)
    config_file = os.environ.get('CONFIG_FILE', None)
    doc_id = os.environ.get('DOC_ID', None)
    app_base_url = os.environ.get('APP_BASE_URL', None)
    doc_s3_url = os.environ.get('DOC_S3_URL', None)
    docs_in_config = doc_portal_spider.get_portal_config(config_file)
    if doc_id:
        doc_objects_to_crawl = [
            doc_object for doc_object in docs_in_config if doc_object.get('id') == doc_id]
    else:
        doc_objects_to_crawl = docs_in_config

    if not doc_objects_to_crawl:
        raise ValueError('The list of docs to crawl is empty. Possible reasons:'
                         '\n\t- The config file does not contain any docs.'
                         '\n\t- The config file does not contain the provided doc ID.'
                         '\n\t- The provided doc ID is invalid.')

    # Testing
    doc_objects_to_crawl = [
        {
            "id": "isbc202111dataarchiving",
            "title": "Data Archiving",
            "url": "cloud/bc/202111/dataarchiving",
            "metadata": {
                "platform": [
                    "Cloud"
                ],
                "product": [
                    "BillingCenter"
                ],
                "version": [
                    "2021.11"
                ],
                "release": [
                    "Dobson"
                ],
                "subject": [
                    "Administration"
                ]
            },
            "environments": [
                "dev",
                "int",
                "staging"
            ],
            "displayOnLandingPages": True,
            "indexForSearch": True,
            "public": False
        },
        {
            "id": "isbc202111devsetup",
            "title": "Developer Setup",
            "url": "cloud/bc/202111/devsetup",
            "metadata": {
                "platform": [
                    "Cloud"
                ],
                "product": [
                    "BillingCenter"
                ],
                "version": [
                    "2021.11"
                ],
                "release": [
                    "Dobson"
                ],
                "subject": [
                    "Installation"
                ]
            },
            "environments": [
                "dev",
                "int",
                "staging"
            ],
            "displayOnLandingPages": True,
            "indexForSearch": True,
            "public": False
        },
    ]
    # Testing
    for doc_object_to_crawl in doc_objects_to_crawl:
        run_spider(spider=doc_portal_spider.DocPortalSpider, docs_to_crawl=[doc_object_to_crawl],
                   root_url=app_base_url,
                   s3_bucket_url=doc_s3_url)


if __name__ == '__main__':
    main()
