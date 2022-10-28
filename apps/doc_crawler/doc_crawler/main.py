import os
from multiprocessing import Process, Queue
from typing import List

from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings

from doc_crawler.spiders import doc_portal_spider


def create_crawler_process(spider, docs_to_crawl: List, root_url: str, s3_bucket_url: str, q):
    try:
        crawler_settings = get_project_settings()
        crawler_settings.set('LOG_FILE', f'doc_crawler_{docs_to_crawl[0]["id"]}.log')
        crawler_process = CrawlerProcess(crawler_settings)
        deferred = crawler_process.crawl(spider, docs=docs_to_crawl, app_base_url=root_url,
                                         doc_s3_url=s3_bucket_url)
        crawler_process.start()
        if deferred.result:
            raise deferred.result.value
        q.put(None)
    except Exception as e:
        q.put(e)


def run_spiders(spider, docs_to_crawl: List, root_url: str, s3_bucket_url: str):
    all_results = []
    queue = Queue()
    for doc in docs_to_crawl:
        process = Process(target=create_crawler_process, args=(spider, [doc], root_url, s3_bucket_url, queue,))
        process.start()
        all_results.append(queue.get())
        process.join()

    if [r for r in all_results if r is not None]:
        raise SystemExit('Crawling process finished with errors')


def check_env_vars():
    env_list = ['CONFIG_FILE', 'APP_BASE_URL',
                'DOC_S3_URL', 'ELASTICSEARCH_URLS',
                'DOCS_INDEX_NAME', 'BROKEN_LINKS_INDEX_NAME', 'SHORT_TOPICS_INDEX_NAME',
                'REPORT_BROKEN_LINKS', 'REPORT_SHORT_TOPICS']
    unset_vars = []
    empty_vars = []
    for env_name in env_list:
        env_value = os.environ.get(env_name, None)
        if env_value is None:
            unset_vars.append(env_name)
        elif env_value == '':
            empty_vars.append(env_name)
    exit_with_error = False
    if unset_vars:
        print(
            f'The following environment variables are not set: {", ".join(unset_vars)}. Required variables: {", ".join(env_list)}')
        exit_with_error = True
    if empty_vars:
        print(
            f'The following environment variables have empty values: {",".join(empty_vars)}')
        exit_with_error = True
    if exit_with_error:
        raise SystemExit(1)
    print('Environment variables:')
    for env_name in env_list:
        print(f'{env_name}: {os.environ[env_name]}')


def main():
    check_env_vars()
    config_file = os.environ['CONFIG_FILE']
    app_base_url = os.environ['APP_BASE_URL']
    doc_s3_url = os.environ['DOC_S3_URL']
    docs_in_config = doc_portal_spider.get_portal_config(config_file)
    doc_id = os.environ.get('DOC_ID', None)
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

    run_spiders(spider=doc_portal_spider.DocPortalSpider, docs_to_crawl=doc_objects_to_crawl,
                root_url=app_base_url,
                s3_bucket_url=doc_s3_url)


if __name__ == '__main__':
    main()
