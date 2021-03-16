import json
from typing import List
from flail_ssg import logger

from pathlib import Path

_log_file = Path.cwd() / 'access_controller.log'
_access_controller_logger = logger.configure_logger(
    'access_controller_logger', 'info', _log_file)


def find_public_pages(build_dir: Path):
    def check_any_item_is_public(page_items: List, any_item_is_public: bool):
        for item in page_items:
            if item.get('public'):
                any_item_is_public = True
            if item.get('items'):
                any_item_is_public = check_any_item_is_public(item['items'], any_item_is_public)
        return any_item_is_public

    public_paths = []
    for index_json_file in build_dir.rglob('**/*.json'):
        index_file_absolute = index_json_file.resolve()
        index_json = json.load(index_file_absolute.open(encoding='utf-8'))
        items = index_json.get('items')
        if items:
            page_is_public = check_any_item_is_public(items, False)
            if page_is_public and index_file_absolute not in public_paths:
                public_paths.append(index_file_absolute)

    return public_paths


def find_all_public_paths(build_dir: Path, all_public_paths: List):
    def find_public_path_in_items(root_dir: Path, page_items: List):
        for item in page_items:
            nonlocal all_public_paths
            if item.get('page'):
                absolute_page_ref = (root_dir / item['page']).resolve()
                if any(page_path for page_path in all_public_paths if absolute_page_ref in page_path.parents):
                    all_public_paths.append(root_dir / 'index.json')
                    all_public_paths += [p / 'index.json' for p in root_dir.parents if p != build_dir]
            if item.get('items'):
                find_public_path_in_items(root_dir, item['items'])
        return page_items

    for index_json_file in build_dir.rglob('**/*.json'):
        index_file_absolute = index_json_file.resolve()
        page_dir = index_file_absolute.parent
        index_json = json.load(index_file_absolute.open(encoding='utf-8'))
        items = index_json.get('items')
        if items:
            find_public_path_in_items(page_dir, items)
    unique_public_paths = sorted([p for p in set(all_public_paths)])
    return unique_public_paths


def write_marked_pages(build_dir: Path, public_paths: List):
    def mark_page_refs_with_public_prop(root_dir: Path, page_items: List):
        for item in page_items:
            nonlocal public_paths
            if item.get('page'):
                item['public'] = False
                absolute_page_ref = (root_dir / item['page']).resolve()
                if any(page_path for page_path in public_paths if absolute_page_ref in page_path.parents):
                    item['public'] = True
            if item.get('items'):
                mark_page_refs_with_public_prop(root_dir, item['items'])
        return page_items

    for index_json_file in build_dir.rglob('**/*.json'):
        index_file_absolute = index_json_file.resolve()
        page_dir = index_file_absolute.parent
        index_json = json.load(index_file_absolute.open(encoding='utf-8'))
        items = index_json.get('items')
        if items:
            mark_page_refs_with_public_prop(page_dir, items)
        json.dump(index_json, index_json_file.open(
            'w', encoding='utf-8'), indent=2)


def set_public_prop_on_docs(build_dir: Path,
                            docs: List):
    def mark_docs_with_public_prop(page_items: List, docs: List):
        for item in page_items:
            item_id = item.get('id')
            if item_id:
                matching_doc_object = next(
                    (doc for doc in docs if doc['id'] == item_id), None)
                item['public'] = matching_doc_object['public']
            if item.get('items'):
                mark_docs_with_public_prop(item['items'], docs)
        return page_items

    for index_json_file in build_dir.rglob('**/*.json'):
        index_file_absolute = index_json_file.resolve()
        index_json = json.load(index_file_absolute.open(encoding='utf-8'))
        items = index_json.get('items')
        if items:
            items_with_public_prop = mark_docs_with_public_prop(items, docs)
            index_json['items'] = items_with_public_prop

        json.dump(index_json, index_file_absolute.open(
            'w', encoding='utf-8'), indent=2)


# TODO: Add a step for checking if bouncer is home
def run_access_controller(send_bouncer_home: bool, build_dir: Path, docs_config_file: Path):
    config_file_json = json.load(docs_config_file.open(encoding='utf-8'))
    docs = config_file_json['docs']

    _access_controller_logger.info('PROCESS STARTED: Mark pages as public')

    set_public_prop_on_docs(build_dir, docs)
    public_paths = find_public_pages(build_dir)
    all_public_paths = find_all_public_paths(build_dir, public_paths)
    write_marked_pages(build_dir, all_public_paths)

    _access_controller_logger.info('PROCESS ENDED: Mark pages as public')
