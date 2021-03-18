import shutil
from pathlib import Path
from typing import Callable, List

from flail_ssg.helpers import configure_logger
from flail_ssg.helpers import load_json_file
from flail_ssg.helpers import write_json_object_to_file

_log_file = Path.cwd() / 'config_generator.log'
_config_generator_logger = configure_logger(
    'config_generator_logger', 'info', _log_file)


def create_breadcrumbs_mapping(pages_build_dir: Path, config_build_dir: Path):
    def get_root_pages_for_doc_urls(page_items: List, doc_urls: List):
        for item in page_items:
            item_doc_url = item.get('doc_url')
            if item_doc_url:
                doc_urls.append(item_doc_url)
            if item.get('items'):
                get_root_pages_for_doc_urls(item['items'], doc_urls)
        return doc_urls

    breadcrumbs = []
    for index_json_file in pages_build_dir.rglob('**/*.json'):
        page_config = load_json_file(index_json_file)
        items = page_config.json_object.get('items')
        if items:
            page_doc_urls = get_root_pages_for_doc_urls(items, [])
            if page_doc_urls:
                for doc_url in page_doc_urls:
                    matching_breadcrumb = next(
                        (item for item in breadcrumbs if item.get('docUrl') == doc_url), None)
                    if matching_breadcrumb:
                        matching_breadcrumb['rootPages'].append(
                            {
                                "label": page_config.json_object['title'],
                                "path": str(index_json_file.relative_to(pages_build_dir).parent)
                            }
                        )
                    else:
                        breadcrumbs.append(
                            {
                                "docUrl": doc_url,
                                "rootPages": [
                                    {
                                        "label": page_config.json_object['title'],
                                        "path": f'/{str(index_json_file.relative_to(pages_build_dir).parent)}'
                                    }
                                ]
                            }
                        )

    write_json_object_to_file(breadcrumbs, config_build_dir / 'breadcrumbs.json')


def run_config_generator(send_bouncer_home: bool, pages_build_dir: Path, config_build_dir: Path):
    def run_process(func: Callable, *args):
        try:
            return func(*args)
        except Exception as e:
            if send_bouncer_home:
                _config_generator_logger.warning(
                    f'**WATCH YOUR BACK: Bouncer is home, errors got inside.**'
                    f'\n{e}')
            else:
                raise e

    _config_generator_logger.info('PROCESS STARTED: Generate frontend configuration')

    if config_build_dir.exists():
        shutil.rmtree(config_build_dir)
    config_build_dir.mkdir(parents=True)

    run_process(create_breadcrumbs_mapping, pages_build_dir, config_build_dir)

    _config_generator_logger.info('PROCESS ENDED: Generate frontend configuration')
