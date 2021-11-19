import copy
from pathlib import Path
from typing import List
from urllib.parse import urlparse

from flail_ssg.helpers import configure_logger, get_doc_object
from flail_ssg.helpers import load_json_file
from flail_ssg.helpers import write_json_object_to_file

_log_file = Path.cwd() / 'generator.log'
_generator_logger = configure_logger(
    'generator_logger', 'info', _log_file)


def create_breadcrumbs(page_dir: Path, build_dir: Path):
    if page_dir == build_dir:
        return None
    breadcrumbs = []
    path = ''
    for parent in sorted(page_dir.parents, key=lambda p: page_dir.parents.index(p), reverse=True):
        if (parent / 'index.json').exists() and parent != build_dir:
            parent_config = load_json_file((parent / 'index.json'))
            path += f'/{parent.name}'
            if parent_config.json_object.get('includeInBreadcrumbs', True):
                parent_title = parent_config.json_object['title']
                breadcrumbs.append(
                    {
                        'label': parent_title,
                        'path': path
                    }
                )

    return breadcrumbs


def generate_search_filters(page_config_json: dict, docs: list) -> dict:
    def page_has_links_to_subpages(items_to_check: list) -> bool:
        for item in items_to_check:
            if item.get('page'):
                return True
            elif item.get('items'):
                return page_has_links_to_subpages(item['items'])

        return False

    def create_search_filters(items_to_process: list, filters=None) -> dict:
        if filters is None:
            filters = {}
        for item in items_to_process:
            if item.get('id'):
                matching_doc_object = get_doc_object(item['id'], docs)
                matching_doc_object_metadata = matching_doc_object['metadata']
                filters['product'] = filters.get('product', []) + matching_doc_object_metadata['product']
                filters['platform'] = filters.get('platform', []) + matching_doc_object_metadata['platform']
                filters['version'] = filters.get('version', []) + matching_doc_object_metadata['version']
            if item.get('items'):
                create_search_filters(item['items'], filters)

        return filters

    def merge_search_filters(existing_filters: dict, new_filters: dict) -> dict:
        if new_filters:
            if existing_filters:
                all_keys = set(list(existing_filters.keys()) + list(new_filters.keys()))
                return {
                    key: list(set(existing_filters.get(key, []) + new_filters.get(key, [])))
                    for key in all_keys
                }
            return new_filters
        elif existing_filters:
            return existing_filters

        return {}

    def sort_filters(unsorted_filters: dict):
        return {
            key: sorted(list(set(value)))
            for key, value in sorted(unsorted_filters.items())
        }

    page_items = page_config_json['items']
    page_search_filters = {}
    if not page_has_links_to_subpages(page_items):
        created_search_filters = create_search_filters(page_items)
        current_search_filters = page_config_json.get('search_filters', {})
        merged_search_filters = merge_search_filters(current_search_filters,
                                                     created_search_filters)
        page_search_filters = merged_search_filters

    return sort_filters(page_search_filters)


def resolve_links(items: List, docs: List):
    for item in items:
        if item.get('id'):
            matching_doc_object = get_doc_object(item['id'], docs)
            matching_doc_object_url = matching_doc_object["url"]
            item['doc_url'] = matching_doc_object_url if bool(
                urlparse(matching_doc_object_url).netloc) else f'/{matching_doc_object_url}'
        if item.get('items'):
            resolve_links(item['items'], docs)
    return items


def generate_page(index_file: Path,
                  docs: List,
                  build_dir: Path,
                  send_bouncer_home: bool):
    page_config = load_json_file(index_file)
    processed_page_config = copy.deepcopy(page_config)
    try:
        page_items = page_config.json_object.get('items')
        if page_items:
            items_with_resolved_links = resolve_links(page_items, docs)
            processed_page_config.json_object['items'] = items_with_resolved_links
            search_filters = generate_search_filters(page_config.json_object, docs)
            if search_filters:
                processed_page_config.json_object['search_filters'] = search_filters

        selector = page_config.json_object.get('selector')
        if selector:
            selector_items = selector.get('items')
            selector_items_with_resolved_links = resolve_links(selector_items, docs)
            processed_page_config.json_object['selector']['items'] = selector_items_with_resolved_links

        processed_page_config.json_object['current_page'] = {
            'label': page_config.json_object['title'],
            'path': page_config.dir.name
        }
        processed_page_config.json_object['breadcrumbs'] = create_breadcrumbs(page_config.dir, build_dir)
    except Exception as e:
        if not send_bouncer_home:
            raise e
        _generator_logger.warning(
            '**WATCH YOUR BACK: Bouncer is home, errors got inside.**')
        page_config.json_object[
            'title'] = f'{page_config.json_object["title"]} - GENERATED WITH ERRORS! CHECK THE VALIDATOR LOG!'
    finally:
        write_json_object_to_file(processed_page_config.json_object, processed_page_config.absolute_path)


def run_generator(send_bouncer_home: bool, build_dir: Path,
                  docs_config_file: Path):
    docs = load_json_file(docs_config_file).json_object['docs']

    _generator_logger.info('PROCESS STARTED: Generate pages')

    for index_json_file in build_dir.rglob('*.json'):
        _generator_logger.info(f'Generating page from {index_json_file}')
        generate_page(index_json_file, docs,
                      build_dir, send_bouncer_home)

    _generator_logger.info('PROCESS ENDED: Generate pages')
