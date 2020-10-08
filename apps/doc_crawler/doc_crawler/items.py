import scrapy


class IndexEntry(scrapy.Item):
    doc_id = scrapy.Field()
    href = scrapy.Field()
    id = scrapy.Field()
    title = scrapy.Field()
    body = scrapy.Field()
    product = scrapy.Field()
    platform = scrapy.Field()
    version = scrapy.Field()


class BrokenLink(scrapy.Item):
    doc_id = scrapy.Field()
    origin_url = scrapy.Field()
    url = scrapy.Field()
    metadata = scrapy.Field()
    title = scrapy.Field()
