import io
import json
import re
from pathlib import Path
from urllib.parse import urljoin, urlsplit
from urllib.parse import urlparse

import scrapy
from scrapy import Request

from ..items import BrokenLink
from ..items import IndexEntry


def get_portal_config(config_file_path: Path, doc_filter_query: str = None):
    with open(config_file_path) as cf:
        file_content = json.load(cf)
    docs_in_config = file_content.get('docs')
    return docs_in_config


def normalize_text(input_text: str):
    removed_whitespace = input_text.replace(
        '\n', ' ').replace('\t', ' ').replace('\r', '').strip()
    removed_multiple_spaces = re.sub('[ ]{2,}', ' ', removed_whitespace)
    removed_empty_lines = filter(lambda x: not x.isspace(),
                                 io.StringIO(removed_multiple_spaces).readlines())
    normalized_text = ' '.join(removed_empty_lines)
    return normalized_text


class DocPortalSpider(scrapy.Spider):
    name = 'Doc portal spider'
    id = 'doc_portal_spider'
    app_base_url = ''
    doc_s3_url = ''
    excluded_types = ['.pdf', '.txt', '.xmind', '.xrb']
    handle_httpstatus_list = [404]

    def start_requests(self):
        for doc in self.docs:
            doc['start_url'] = urljoin(self.doc_s3_url, doc['url'])
            yield Request(doc['start_url'], self.parse, cb_kwargs={'doc_object': doc})

    def parse(self, response, **cb_kwargs):

        doc_object = cb_kwargs.get('doc_object')
        doc_object_id = doc_object['id']

        if response.status == 404:
            broken_link = BrokenLink(
                doc_id=doc_object_id,
                origin_url=cb_kwargs.get('origin_url', 'No origin URL'),
                url=response.url,
                metadata=doc_object['metadata'],
                title=doc_object['title'],
            )

            yield broken_link
        else:
            index_entry_href = urljoin(self.app_base_url, urlsplit(response.url).path) if not urlparse(
                doc_object['url']).hostname else response.url
            index_entry_id = urlparse(response.url).path
            index_entry_title = response.xpath('/html/head/title/text()').get()
            index_entry_product = doc_object['metadata']['product']
            index_entry_platform = doc_object['metadata']['platform']
            index_entry_version = doc_object['metadata']['version']
            index_entry_public = doc_object['public']

            dita_default_selector = response.xpath(
                '//*[contains(@class, "body")]')
            dita_chunk_selector = response.xpath(
                '//*[contains(@class, "nested0")]')
            framemaker_default_selector = response.xpath('//body/blockquote')
            docusaurus_selector = response.xpath(
                '//div[@class = "markdown"]')

            body_elements = []
            if dita_default_selector:
                body_elements = dita_default_selector
            elif dita_chunk_selector:
                body_elements = dita_chunk_selector
            elif framemaker_default_selector:
                body_elements = framemaker_default_selector
            elif docusaurus_selector:
                body_elements = docusaurus_selector

            index_entry_body = ''
            for body_element in body_elements:
                body_text = ' '.join(
                    body_element.xpath('.//*/text()').getall())
                index_entry_body += f'{normalize_text(body_text)} '

            index_entry = IndexEntry(
                doc_id=doc_object_id,
                href=index_entry_href,
                id=index_entry_id,
                title=index_entry_title,
                body=index_entry_body,
                product=index_entry_product,
                platform=index_entry_platform,
                version=index_entry_version,
                public=index_entry_public
            )

            yield index_entry

            for next_page in response.xpath('//a[@href]'):
                next_page_href = next_page.attrib.get('href')
                if any(excl_type in urlparse(next_page_href).path for excl_type in self.excluded_types):
                    continue
                next_page_abs_url = response.urljoin(next_page_href)
                if doc_object['start_url'] in next_page_abs_url:
                    yield response.follow(next_page, callback=self.parse,
                                          cb_kwargs={'origin_url': response.url, 'doc_object': doc_object})
