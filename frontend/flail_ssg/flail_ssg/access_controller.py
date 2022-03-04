import copy
from pathlib import Path
from typing import Callable

from flail_ssg.helpers import configure_logger
from flail_ssg.helpers import load_json_file
from flail_ssg.helpers import write_json_object_to_file

_log_file = Path.cwd() / 'access_controller.log'
_access_controller_logger = configure_logger(
    'access_controller_logger', 'info', _log_file)


def get_items_on_page(items_to_process: list[dict], filter_property: str) -> list[dict]:
    if filter_property:
        all_items = [item for item in items_to_process if item.get(filter_property)]
    else:
        all_items = copy.deepcopy(items_to_process)
    for item in items_to_process:
        if item_items := item.get('items'):
            all_items.extend(get_items_on_page(item_items, filter_property))
    return all_items


def check_page_contains_public_items(doc_and_page_items: list[dict]) -> bool:
    return any(item.get('public') for item in doc_and_page_items) if doc_and_page_items else False


def check_page_contains_only_internal_items(doc_and_page_items: list[dict]) -> bool:
    return all(item.get('internal') for item in doc_and_page_items) if doc_and_page_items else False


def validate_items_are_not_public_and_internal(build_dir: Path):
    for index_json_file in build_dir.rglob('*.json'):
        page_config = load_json_file(index_json_file)
        if items := page_config.json_object.get('items'):
            doc_items = get_items_on_page(items, 'id')
            if invalid_doc_items := [item for item in doc_items if item['public'] and item['internal']]:
                _access_controller_logger.error(
                    'Found doc references that have both "public" and "internal" properties set to "true"!'
                )
                _access_controller_logger.error(f'\tPage config path: {page_config.absolute_path}')
                for invalid_item in invalid_doc_items:
                    _access_controller_logger.error(f'\t\tItem label: {invalid_item["label"]}')
                raise SystemExit('VALIDATION FAILED')


def add_public_and_internal_props_to_page_configs(build_dir: Path):
    for index_json_file in build_dir.rglob('*.json'):
        page_config = load_json_file(index_json_file)
        items = page_config.json_object.get('items')
        updated_page_config = copy.deepcopy(page_config)
        if items:
            # Add the internal and public properties to page configs to mark pages that aren't referenced from anywhere
            doc_and_page_items = get_items_on_page(items, 'page') + get_items_on_page(items, 'id')
            updated_page_config.json_object['public'] = check_page_contains_public_items(doc_and_page_items)
            updated_page_config.json_object['internal'] = check_page_contains_only_internal_items(doc_and_page_items)
        write_json_object_to_file(updated_page_config.json_object, updated_page_config.absolute_path)


def set_public_and_internal_props_on_all_page_refs(build_dir: Path, public_paths: list[Path],
                                                   internal_paths: list[Path]):
    def mark_page_refs_with_public_and_internal_props(page_config_dir: Path, page_items: list[dict]) -> list[dict]:
        updated_items = copy.deepcopy(page_items)
        for item in updated_items:
            if item_path := item.get('page'):
                absolute_page_ref = (page_config_dir / item_path).resolve()
                item['public'] = False
                # EXAMPLE: apiReferences contains three dirs:
                #     banff -> not public, linked from apiReferences
                #     cortina -> public, not linked from apiReferences
                #     dobson -> public, not linked from apiReferences
                # apiReferences should not be public
                if any(absolute_page_ref == page_path.parent for page_path in public_paths):
                    item['public'] = True
                item['internal'] = False
                if any(page_path.parent == absolute_page_ref for page_path in internal_paths):
                    item['internal'] = True
            if item_items := item.get('items'):
                item['items'] = mark_page_refs_with_public_and_internal_props(page_config_dir, item_items)
        return updated_items

    updated_public_paths = copy.deepcopy(public_paths)
    updated_internal_paths = copy.deepcopy(internal_paths)
    for index_json_file in build_dir.rglob('*.json'):
        page_config = load_json_file(index_json_file)
        items = page_config.json_object.get('items')
        updated_page_config = copy.deepcopy(page_config)
        if items:
            marked_items = mark_page_refs_with_public_and_internal_props(page_config.dir, items)
            updated_page_config.json_object['items'] = marked_items
            marked_doc_and_page_items = get_items_on_page(marked_items, 'page') + get_items_on_page(marked_items, 'id')
            page_contains_public_items = check_page_contains_public_items(marked_doc_and_page_items)
            if page_contains_public_items and updated_page_config.absolute_path not in updated_public_paths:
                updated_public_paths.append(updated_page_config.absolute_path)
            page_contains_only_internal_items = check_page_contains_only_internal_items(marked_doc_and_page_items)
            if page_contains_only_internal_items and (
                    updated_page_config.absolute_path not in updated_internal_paths):
                updated_internal_paths.append(updated_page_config.absolute_path)
        write_json_object_to_file(updated_page_config.json_object, updated_page_config.absolute_path)
    if sorted(updated_internal_paths) != sorted(internal_paths):
        set_public_and_internal_props_on_all_page_refs(build_dir, updated_public_paths, updated_internal_paths)
    if sorted(updated_public_paths) != sorted(public_paths):
        set_public_and_internal_props_on_all_page_refs(build_dir, updated_public_paths, updated_internal_paths)


def set_public_and_internal_props_on_doc_refs(build_dir: Path, docs: list[dict]) -> tuple[list[Path], list[Path]]:
    def mark_doc_refs_with_public_and_internal_props(items_to_process: list[dict]) -> list[dict]:
        updated_items = copy.deepcopy(items_to_process)
        for item in updated_items:
            if item_id := item.get('id'):
                matching_doc_object = next(
                    (doc for doc in docs if doc['id'] == item_id), None)
                item['public'] = matching_doc_object.get('public', False)
                item['internal'] = matching_doc_object.get('internal', True)
            if item_items := item.get('items'):
                item['items'] = mark_doc_refs_with_public_and_internal_props(item_items)
        return updated_items

    def check_page_contains_public_docs(doc_items: list[dict]) -> bool:
        return any(item.get('public') for item in doc_items) if doc_items else False

    def check_page_contains_only_internal_docs(doc_items: list[dict], page_items: list[dict]) -> bool:
        # Page items are checked later and they can be internal or not. Here, we only check if the page has only
        # internal doc references
        if page_items:
            return False
        return all(item.get('internal') for item in doc_items) if doc_items else False

    pages_with_public_docs = []
    pages_with_only_internal_docs = []
    for index_json_file in build_dir.rglob('*.json'):
        page_config = load_json_file(index_json_file)
        items = page_config.json_object.get('items')
        updated_page_config = copy.deepcopy(page_config)
        if items:
            marked_items = mark_doc_refs_with_public_and_internal_props(items)
            updated_page_config.json_object['items'] = marked_items
            marked_doc_items = get_items_on_page(marked_items, 'id')
            marked_page_items = get_items_on_page(marked_items, 'page')
            page_contains_public_docs = check_page_contains_public_docs(marked_doc_items)
            page_contains_only_internal_docs = check_page_contains_only_internal_docs(marked_doc_items,
                                                                                      marked_page_items)
            if page_contains_public_docs and updated_page_config.absolute_path not in pages_with_public_docs:
                pages_with_public_docs.append(updated_page_config.absolute_path)
            if page_contains_only_internal_docs and updated_page_config.absolute_path not in pages_with_only_internal_docs:
                pages_with_only_internal_docs.append(updated_page_config.absolute_path)

        write_json_object_to_file(updated_page_config.json_object, updated_page_config.absolute_path)
    return pages_with_public_docs, pages_with_only_internal_docs


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
                raise e from e

    docs = load_json_file(docs_config_file).json_object['docs']

    _access_controller_logger.info('PROCESS STARTED: Mark pages as public and internal')
    # Step 1:
    # a) Mark doc refs in page configs with the 'public' and 'internal' props,
    # b) After doc refs are marked, check which pages contain public docs and only internal docs
    # c) Write modified pages
    # RESULT: list of pages that contain public docs and list of pages that contain only internal docs
    pages_with_public_docs, pages_with_only_internal_docs = run_process(set_public_and_internal_props_on_doc_refs,
                                                                        build_dir,
                                                                        docs)
    # Step 2:
    # a) Mark all page refs with the public and internal props
    # b) Write modified pages
    run_process(set_public_and_internal_props_on_all_page_refs, build_dir,
                pages_with_public_docs, pages_with_only_internal_docs)
    # Step 3 - add the public and internal props to all page configs
    add_public_and_internal_props_to_page_configs(build_dir)
    validate_items_are_not_public_and_internal(build_dir)
    _access_controller_logger.info('PROCESS ENDED: Mark pages as public and internal')
