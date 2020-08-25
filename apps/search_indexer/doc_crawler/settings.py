BOT_NAME = 'doc_crawler'
SPIDER_MODULES = ['doc_crawler.spiders']
LOG_LEVEL = 'INFO'
LOG_FILE = 'search_indexer.log'
DEFAULT_REQUEST_HEADERS = {'Referer': 'https://docs.guidewire.com'}
ITEM_PIPELINES = {
    'doc_crawler.pipelines.ElasticsearchPipeline': 100,
}
