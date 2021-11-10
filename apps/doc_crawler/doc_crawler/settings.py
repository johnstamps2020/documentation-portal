BOT_NAME = 'doc_crawler'
SPIDER_MODULES = ['doc_crawler.spiders']
LOG_ENABLED = True
LOG_LEVEL = 'INFO'
DEFAULT_REQUEST_HEADERS = {'Referer': 'https://docs.guidewire.com'}
ITEM_PIPELINES = {
    'doc_crawler.pipelines.ElasticsearchPipeline': 100,
}
