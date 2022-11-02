import io
import json
import os
import re
from datetime import date
from pathlib import Path
from urllib.parse import urljoin, urlsplit
from urllib.parse import urlparse

import scrapy
from scrapy import Request
from textstat import textstat

from ..items import BrokenLink, IndexEntry, ShortTopic


def get_portal_config(config_file_path: str):
    with open(config_file_path) as cf:
        file_content = json.load(cf)
    return file_content.get('docs')


def normalize_text(input_text: str):
    removed_whitespace = input_text.replace(
        '\n', ' ').replace('\t', ' ').replace('\r', '').strip()
    removed_multiple_spaces = re.sub('[ ]{2,}', ' ', removed_whitespace)
    removed_empty_lines = filter(lambda x: not x.isspace(),
                                 io.StringIO(removed_multiple_spaces).readlines())
    return ' '.join(removed_empty_lines)


class DocPortalSpider(scrapy.Spider):
    name = 'Doc portal spider'
    id = 'doc_portal_spider'
    docs = []
    app_base_url = ''
    doc_s3_url = ''
    excluded_types = ['.pdf', '.txt', '.xmind', '.xrb', '.svg']
    handle_httpstatus_list = [404]
    report_broken_links = os.environ.get('REPORT_BROKEN_LINKS', 'yes').casefold() in ['yes', '']
    report_short_topics = os.environ.get('REPORT_SHORT_TOPICS', 'yes').casefold() in ['yes', '']

    def start_requests(self):
        for doc in self.docs:
            doc['start_url'] = urljoin(self.doc_s3_url, doc['url'])
            yield Request(doc['start_url'], self.parse, cb_kwargs={'doc_object': doc})

    def parse(self, response: scrapy.http.Response, **cb_kwargs):
        doc_object = cb_kwargs.get('doc_object')
        doc_object_id = doc_object['id']
        doc_object_title = doc_object['title']
        doc_object_body = doc_object.get('body')
        doc_object_metadata = doc_object['metadata']
        doc_object_product = doc_object_metadata.get('product')
        doc_object_platform = doc_object_metadata.get('platform')
        doc_object_version = doc_object_metadata.get('version')
        doc_object_release = doc_object_metadata.get('release')
        doc_object_subject = doc_object_metadata.get('subject')
        doc_object_public = doc_object['public']
        doc_object_internal = doc_object['internal']

        def replace_s3_url_with_app_base_url(url: str) -> str:
            return url.replace(self.doc_s3_url, self.app_base_url)

        def topic_is_short(word_count: int) -> bool:
            if self.report_short_topics and word_count < 100:
                contains_redirect_script = response.xpath('//script[@src="/scripts/html5skip.js"]')
                if not contains_redirect_script:
                    return True
            return False

        if response.status == 404 and self.report_broken_links:
            yield BrokenLink(doc_id=doc_object_id,
                             origin_url=replace_s3_url_with_app_base_url(cb_kwargs.get('origin_url', 'No origin URL')),
                             url=replace_s3_url_with_app_base_url(response.url), metadata=doc_object_metadata,
                             title=doc_object_title, )

        elif doc_object_body:
            yield IndexEntry(
                doc_id=doc_object_id,
                href=doc_object['url'],
                id=doc_object_id,
                title=doc_object_title,
                body=doc_object_body,
                product=doc_object_product,
                platform=doc_object_platform,
                version=doc_object_version,
                release=doc_object_release,
                subject=doc_object_subject,
                doc_title=doc_object_title,
                public=doc_object_public,
                internal=doc_object_internal,
                indexed_date=date.today().isoformat()
            )
        else:
            index_entry_href = response.url if urlparse(doc_object['url']).hostname else urljoin(self.app_base_url,
                                                                                                 urlsplit(
                                                                                                     response.url).path)
            index_entry_id = urlparse(response.url).path
            index_entry_title = response.xpath('/html/head/title/text()').get()
            index_entry_date = date.today().isoformat()

            selectors = {
                'webhelp_selector': response.xpath(
                    '//main[@role = "main"]'),
                'legacy_webhelp_selector': response.xpath(
                    '//body[h1[contains(@class, "title")] and div[contains(@class, "body")]]'),
                'webworks_selector': response.xpath('//body/*[div[@class="B_-_Body"]]'),
                'docusaurus_selector': response.xpath(
                    '//div[@class = "markdown"]'),
                'main_selector': response.xpath(
                    '//main')
            }

            body_elements = next(
                (exp for exp in selectors.values() if exp), '')

            web_works_output = response.xpath(
                '//body[@onload="WWHHelpFrame_LaunchHelp();"]')
            if not body_elements and web_works_output and 'portal/secure/doc' in response.url:
                yield response.follow(urljoin(response.url, 'all_files.html'), callback=self.parse,
                                      cb_kwargs={'origin_url': response.url, 'doc_object': doc_object})
            index_entry_body = ''
            for body_element in body_elements:
                body_text = ' '.join(
                    body_element.xpath('.//*/text()').getall())
                index_entry_body += f'{normalize_text(body_text)} '

            yield IndexEntry(doc_id=doc_object_id, href=index_entry_href, id=index_entry_id, title=index_entry_title,
                             body=index_entry_body, product=doc_object_product, platform=doc_object_platform,
                             version=doc_object_version, release=doc_object_release, subject=doc_object_subject,
                             doc_title=doc_object_title, public=doc_object_public, internal=doc_object_internal,
                             indexed_date=index_entry_date)

            number_of_words = textstat.lexicon_count(index_entry_body)
            if topic_is_short(number_of_words):
                yield ShortTopic(doc_id=doc_object_id,
                                 doc_title=doc_object_title,
                                 href=index_entry_href,
                                 id=index_entry_id,
                                 title=index_entry_title,
                                 number_of_words=number_of_words,
                                 product=doc_object_product,
                                 platform=doc_object_platform,
                                 version=doc_object_version,
                                 release=doc_object_release)

            for next_page in response.xpath('//a[@href]'):
                next_page_href = next_page.attrib.get('href')
                if any(excl_type in urlparse(next_page_href).path for excl_type in self.excluded_types):
                    continue
                next_page_abs_url = response.urljoin(next_page_href)
                start_url = doc_object['start_url']
                last_path_element = str(
                    urlparse(start_url).path.split('/')[-1])
                if Path(last_path_element).suffix:
                    start_url = f'{start_url.replace(last_path_element, "")}'
                if start_url in next_page_abs_url:
                    yield response.follow(next_page, callback=self.parse,
                                          cb_kwargs={'origin_url': response.url, 'doc_object': doc_object})
