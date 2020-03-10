import io
import json
import os
import re
from pathlib import Path

import custom_utils.utils as custom_utils
import scrapy
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings

config = Path(os.environ['CONFIG_FILE'])
start_urls = os.environ['CRAWLER_START_URLS'].split(' ')
allowed_domains = os.environ['CRAWLER_ALLOWED_DOMAINS'].split(' ')

current_dir = Path(__file__).parent
feed_file = current_dir / 'documents.json'
template_dir = current_dir / 'src' / 'templates'
out_dir = current_dir / 'out'
broken_links_template_file = 'broken-links.html'
broken_links_report = out_dir / broken_links_template_file
broken_links = []


def normalize_text(input_text: str):
    input_text_no_whitespace = input_text.replace('\n', ' ').replace('\t', ' ').replace('\r', '').strip()
    input_text_no_multiple_spaces = re.sub('[ ]{2,}', ' ', input_text_no_whitespace)
    topic_text_no_empty_lines = filter(lambda x: not x.isspace(),
                                       io.StringIO(input_text_no_multiple_spaces).readlines())
    normalized_text = ' '.join(topic_text_no_empty_lines)

    return normalized_text


def group_broken_links_by_origin(links: list):
    grouped_links = []
    unique_origin_urls = set((link.get('origin_url') for link in links))
    for unique_url in unique_origin_urls:
        grouped_links.append(
            {
                'origin_url': unique_url,
                'urls': []
            }
        )

    for link in links:
        for grouped_link in grouped_links:
            if link.get('origin_url') == grouped_link.get('origin_url'):
                grouped_link['urls'].append(link.get('url'))

    sorted_grouped_links = sorted(grouped_links, key=lambda x: x['origin_url'], reverse=False)
    for link in sorted_grouped_links:
        link['urls'] = sorted(link['urls'])

    return sorted_grouped_links


def crawl_pages(spider_class: type(scrapy.Spider), **kwargs):
    if feed_file.exists():
        feed_file.unlink()

    process = CrawlerProcess(get_project_settings())
    process.crawl(spider_class, **kwargs)
    process.start()

    broken_links_page_content = custom_utils.render_str_from_template(template_dir / broken_links_template_file,
                                                                      broken_links=group_broken_links_by_origin(
                                                                          broken_links),
                                                                      page_title='Broken links report')
    custom_utils.prepare_out_dir(out_dir)
    custom_utils.write_content_to_file(broken_links_page_content, broken_links_report)


class DocPortalSpider(scrapy.Spider):
    handle_httpstatus_list = [404]
    name = 'Doc portal light spider'
    custom_settings = {
        'LOG_LEVEL': 'INFO',
        'FEED_FORMAT': 'jsonlines',
        'FEED_URI': f'{feed_file}',
    }

    with open(config, 'r') as config_file:
        config_file_content = json.load(config_file)

    keyword_map = {}

    for doc_set in config_file_content:
        if doc_set.get('docPackages') is not None:
            platform = doc_set.get('platform')
            for package in doc_set.get('docPackages'):
                for doc in package.get('docs'):
                    product = doc.get('product')
                    for release in doc.get('releases'):
                        keyword_map[release.get('url')] = {
                            "platform": platform,
                            "product": product,
                            "version": release.get('version')
                        }

    def parse(self, response, **cb_kwargs):

        if response.status == 404:
            broken_links.append(
                {
                    'origin_url': cb_kwargs.get('origin_url'), 'url': response.url
                }
            )
        else:
            page_object = {}

            regex = re.compile('^[^/]*//[^/]*')
            page_object_id = response.url.replace(re.match(regex, response.url).group(0), '')
            page_object['id'] = page_object_id

            for url, keywords in self.keyword_map.items():
                if url in page_object_id:
                    for name, value in keywords.items():
                        page_object[name] = value
                    continue

            title_elements = response.xpath('/html/head/title')
            for title_element in title_elements:
                page_object['title'] = title_element.xpath('text()').get()

            body_elements = []
            if response.xpath('//*[contains(@class, "body")]'):
                body_elements = response.xpath('//*[contains(@class, "body")]')
            elif response.xpath('//*[contains(@class, "nested0")]'):
                body_elements = response.xpath('//*[contains(@class, "nested0")]')

            for body_element in body_elements:
                raw_body = ' '.join(body_element.xpath('.//*/text()').getall())
                page_object['body'] = normalize_text(raw_body)

            yield page_object

        for next_page in response.xpath('//a[@href]'):
            next_page_href = next_page.attrib.get('href')
            if next_page_href.endswith('.pdf'):
                continue
            next_page_abs_url = response.urljoin(next_page_href)
            if any(url in next_page_abs_url for url in self.start_urls):
                yield response.follow(next_page, callback=self.parse, cb_kwargs={'origin_url': response.url})


if __name__ == '__main__':
    crawl_pages(DocPortalSpider, start_urls=start_urls, allowed_domains=allowed_domains)
