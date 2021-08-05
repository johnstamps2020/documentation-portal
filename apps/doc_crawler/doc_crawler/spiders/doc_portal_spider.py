import io
import json
import re
from datetime import date
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
            index_entry_product = doc_object.get('metadata').get('product')
            index_entry_platform = doc_object.get('metadata').get('platform')
            index_entry_version = doc_object.get('metadata').get('version')
            index_entry_release = doc_object.get('metadata').get('release')
            index_entry_subject = doc_object.get('metadata').get('subject')
            index_entry_doc_title = doc_object['title']
            index_entry_public = doc_object['public']
            index_entry_date = date.today().isoformat()

            is_index_entry_internal = response.xpath(
                '/html/head/meta[@name="internal" and @content="true"]').get()
            index_entry_internal = bool(is_index_entry_internal)

            selectors = {
                'webhelp_selector': response.xpath(
                    '//main[@role = "main"]'),
                'legacy_webhelp_selector': response.xpath(
                    '//body[h1[contains(@class, "title")] and div[contains(@class, "body")]]'),
                'webworks_selector': response.xpath('//body/*[div[@class="B_-_Body"]]'),
                'docusaurus_selector': response.xpath(
                    '//div[@class = "markdown"]'),
                'sphinx_selector': response.xpath(
                    '//div[@itemprop = "articleBody"]')
            }

            body_elements = next((exp for exp in selectors.values() if exp), '')

            web_works_output = response.xpath('//body[@onload="WWHHelpFrame_LaunchHelp();"]')
            if not body_elements and web_works_output and 'portal/secure/doc' in response.url:
                yield response.follow(urljoin(response.url, 'all_files.html'), callback=self.parse,
                                      cb_kwargs={'origin_url': response.url, 'doc_object': doc_object})
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
                release=index_entry_release,
                subject=index_entry_subject,
                doc_title=index_entry_doc_title,
                public=index_entry_public,
                internal=index_entry_internal,
                indexed_date=index_entry_date
            )

            yield index_entry

            for next_page in response.xpath('//a[@href]'):
                next_page_href = next_page.attrib.get('href')
                if any(excl_type in urlparse(next_page_href).path for excl_type in self.excluded_types):
                    continue
                next_page_abs_url = response.urljoin(next_page_href)
                start_url = doc_object['start_url']
                last_path_element = str(urlparse(start_url).path.split('/')[-1])
                if Path(last_path_element).suffix:
                    start_url = f'{start_url.replace(last_path_element, "")}'
                if start_url in next_page_abs_url:
                    yield response.follow(next_page, callback=self.parse,
                                          cb_kwargs={'origin_url': response.url, 'doc_object': doc_object})
