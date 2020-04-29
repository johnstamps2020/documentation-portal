import filecmp
import json
import os
import sys
from pathlib import Path

local_modules_path = os.path.abspath(Path(__file__).parent.parent.parent)
sys.path.insert(0, local_modules_path)

import elastic_search.collect_documents as collector

current_dir = Path(__file__).parent
resources = current_dir / 'resources'
expected = resources / 'expected'
config = collector.config
start_url = collector.start_url
allowed_domains = collector.allowed_domains
feed_file = collector.feed_file

broken_links_report = collector.resolve_broken_links_report_path(start_url, collector.out_dir,
                                                                 collector.broken_links_template_file)
start_urls = collector.get_start_urls(start_url)
collector.crawl_pages(collector.DocPortalSpider, start_urls=start_urls, allowed_domains=allowed_domains)


def test_normalize_text():
    input_text = ' This is   some text with \n unneeded whitespace characters\r. It will become \t nice after cleaning. '
    normalized_text = collector.normalize_text(input_text)
    expected_text = 'This is some text with unneeded whitespace characters. It will become nice after cleaning.'
    assert normalized_text == expected_text


def test_feed_file():
    assert feed_file.exists()
    with open(feed_file) as f:
        index_entries = [json.loads(line) for line in f]
    assert len(index_entries) == 29


def test_broken_links_report():
    expected_broken_links_report = expected / 'broken-links.html'
    assert broken_links_report.exists()
    assert filecmp.cmp(broken_links_report, expected_broken_links_report, shallow=False)
