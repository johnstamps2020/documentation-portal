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
    release = scrapy.Field()
    subject = scrapy.Field()
    doc_title = scrapy.Field()
    public = scrapy.Field()
    internal = scrapy.Field()
    indexed_date = scrapy.Field()


class BrokenLink(scrapy.Item):
    doc_id = scrapy.Field()
    origin_url = scrapy.Field()
    url = scrapy.Field()
    metadata = scrapy.Field()
    title = scrapy.Field()


class ShortTopic(scrapy.Item):
    doc_id = scrapy.Field()
    doc_title = scrapy.Field()
    href = scrapy.Field()
    id = scrapy.Field()
    title = scrapy.Field()
    number_of_words = scrapy.Field()
    product = scrapy.Field()
    platform = scrapy.Field()
    version = scrapy.Field()
    release = scrapy.Field()
