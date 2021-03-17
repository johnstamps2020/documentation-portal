from pathlib import Path
from typing import Callable, List

from flail_ssg.helpers import configure_logger
from flail_ssg.helpers import load_json_file
from flail_ssg.helpers import write_json_object_to_file

_log_file = Path.cwd() / 'access_controller.log'
_access_controller_logger = configure_logger(
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
        page_config = load_json_file(index_json_file)
        items = page_config.json_object.get('items')
        if items:
            page_is_public = check_any_item_is_public(items, False)
            if page_is_public and page_config.absolute_path not in public_paths:
                public_paths.append(page_config.absolute_path)

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
        page_config = load_json_file(index_json_file)
        items = page_config.json_object.get('items')
        if items:
            find_public_path_in_items(page_config.dir, items)
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
        page_config = load_json_file(index_json_file)
        items = page_config.json_object.get('items')
        if items:
            mark_page_refs_with_public_prop(page_config.dir, items)
        write_json_object_to_file(page_config.json_object, page_config.absolute_path)


def set_public_prop_on_docs(build_dir: Path,
                            docs: List):
    def mark_docs_with_public_prop(page_items: List):
        for item in page_items:
            item_id = item.get('id')
            if item_id:
                matching_doc_object = next(
                    (doc for doc in docs if doc['id'] == item_id), None)
                item['public'] = matching_doc_object['public']
            if item.get('items'):
                mark_docs_with_public_prop(item['items'])
        return page_items

    for index_json_file in build_dir.rglob('**/*.json'):
        page_config = load_json_file(index_json_file)
        items = page_config.json_object.get('items')
        if items:
            mark_docs_with_public_prop(items)

        write_json_object_to_file(page_config.json_object, page_config.absolute_path)


def run_access_controller(send_bouncer_home: bool, build_dir: Path, docs_config_file: Path):
    def run_process(func: Callable, *args):
        try:
            return func(*args)
        except Exception as e:
            if send_bouncer_home:
                _access_controller_logger.warning(
                    f'**WATCH YOUR BACK: Bouncer is home, errors got inside.**'
                    f'\n{e}')
            else:
                raise e

    docs_config = load_json_file(docs_config_file)
    docs = docs_config.json_object['docs']

    _access_controller_logger.info('PROCESS STARTED: Mark pages as public')
    run_process(set_public_prop_on_docs, build_dir, docs)
    public_paths = run_process(find_public_pages, build_dir)
    all_public_paths = run_process(find_all_public_paths, build_dir, public_paths)
    write_marked_pages(build_dir, all_public_paths)

    _access_controller_logger.info('PROCESS ENDED: Mark pages as public')
