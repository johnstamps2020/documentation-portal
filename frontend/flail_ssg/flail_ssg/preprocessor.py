import copy
import shutil
from pathlib import Path
from typing import Tuple

from flail_ssg.helpers import configure_logger, get_doc_object, load_json_file, write_json_object_to_file

_log_file = Path.cwd() / 'preprocessor.log'
_preprocessor_logger = configure_logger(
    'preprocessor_logger', 'info', _log_file)


def include_item(env: str, item_envs: list) -> bool:
    return not item_envs or env in item_envs


def page_has_items(index_file: Path) -> bool:
    if not index_file.exists():
        return False
    page_config = load_json_file(index_file)
    page_items = page_config.json_object.get('items')
    return bool(page_items)


def filter_by_env(deploy_env: str, current_page_dir: Path, items: list, docs: list) -> Tuple[
    list, list]:
    def get_inner_pages_for_removal(sub_items: dict):
        pages_for_removal = []
        for sub_item in sub_items:
            if sub_item.get('page'):
                pages_for_removal.append(current_page_dir / sub_item['page'])
            sub_item_items = sub_item.get('items')
            if sub_item_items:
                sub_pages_for_removal = get_inner_pages_for_removal(sub_item_items)
                pages_for_removal += sub_pages_for_removal

        return pages_for_removal

    filtered_items = []
    filtered_pages_to_remove = []
    for item in items:
        item_envs = item.get('env', [])
        if not item_envs and item.get('id'):
            matching_doc_object = get_doc_object(item['id'], docs)
            item_envs = matching_doc_object['environments']
        item_items = item.get('items')
        if include_item(deploy_env, item_envs):
            item_to_include = copy.deepcopy(item)
            if item_items:
                inner_items, inner_pages_to_remove = filter_by_env(
                    deploy_env, current_page_dir, item_items, docs)
                if inner_items:
                    item_to_include['items'] = inner_items
                    filtered_items.append(item_to_include)
                if inner_pages_to_remove:
                    filtered_pages_to_remove += inner_pages_to_remove
            else:
                filtered_items.append(item_to_include)
        elif item.get('page'):
            page_path = current_page_dir / item['page']
            filtered_pages_to_remove.append(page_path)
        elif item_items:
            inner_pages_for_removal = get_inner_pages_for_removal(item_items)
            filtered_pages_to_remove += inner_pages_for_removal

    return filtered_items, filtered_pages_to_remove


def find_refs_to_empty_pages(current_page_dir: Path, items: list) -> Tuple[list, list]:
    updated_items = []
    empty_pages_to_remove = []
    for item in items:
        if item.get('page'):
            page_config_path = current_page_dir / item['page'] / 'index.json'
            page_has_content = page_has_items(page_config_path)
            if page_has_content:
                updated_items.append(item)
            else:
                empty_pages_to_remove.append(page_config_path)
        else:
            updated_items.append(item)
        inner_items = item.get('items')
        if inner_items:
            updated_inner_items, inner_empty_pages_to_remove = find_refs_to_empty_pages(current_page_dir,
                                                                                        item['items'])
            item['items'] = updated_inner_items
            empty_pages_to_remove += inner_empty_pages_to_remove
    return updated_items, empty_pages_to_remove


def find_empty_pages_without_links(root_path: Path) -> list[Path]:
    empty_pages_to_remove = []
    for index_json_file in root_path.rglob('*.json'):
        page_has_content = page_has_items(index_json_file)
        if not page_has_content:
            empty_pages_to_remove.append(index_json_file)
    return empty_pages_to_remove


def remove_items_with_empty_child_items(items: list) -> list:
    updated_items = []
    for item in items:
        inner_items = item.get('items', None)
        if inner_items is None:
            updated_items.append(item)
        elif len(inner_items) > 0:
            updated_item = copy.deepcopy(item)
            updated_inner_items = remove_items_with_empty_child_items(inner_items)
            updated_item['items'] = updated_inner_items
            updated_items.append(updated_item)

    return updated_items


def remove_duplicated_paths(paths: list[Path]) -> list:
    return list({path.resolve() for path in paths})


def remove_page_configs(page_configs_to_remove: list[Path]) -> Tuple[list, list]:
    removed_page_configs = []
    failed_removals = []
    for page_config in page_configs_to_remove:
        try:
            page_config.unlink(missing_ok=True)
            removed_page_configs.append(page_config)
        except Exception as e:
            failed_removals.append(
                {'path': page_config,
                 'error': e}
            )
    return removed_page_configs, failed_removals


def remove_page_dirs(pages_to_remove: list[Path]) -> Tuple[list, list]:
    removed_page_dirs = []
    failed_removals = []
    for page_path in pages_to_remove:
        try:
            shutil.rmtree(page_path)
            removed_page_dirs.append(page_path)
        except Exception as e:
            failed_removals.append(
                {'path': page_path,
                 'error': e}
            )
    return removed_page_dirs, failed_removals


def remove_empty_dirs(root_path: Path, removed_dirs: list, failed_removals: list) -> Tuple[list, list]:
    empty_dirs = [p for p in root_path.rglob('*') if p.is_dir() and not list(p.iterdir())]
    if not empty_dirs:
        return removed_dirs, failed_removals
    for empty_dir in empty_dirs:
        try:
            empty_dir.rmdir()
            removed_dirs.append(empty_dir)
        except Exception as e:
            failed_removals.append(
                {'path': empty_dir,
                 'error': e}
            )
    return remove_empty_dirs(root_path, removed_dirs, failed_removals)


def log_remove_operation_result(removed_items: list[Path], items_not_removed: list[Path], start_log_message: str):
    _preprocessor_logger.info(start_log_message)
    if removed_items:
        _preprocessor_logger.info(
            f'Removed items: {len(removed_items)}')
        for i, removed_dir in enumerate(removed_items, start=1):
            _preprocessor_logger.info(f'\t{i} {removed_dir}')
    if items_not_removed:
        _preprocessor_logger.warning(
            f'Failed to remove items: {len(items_not_removed)}')
        for i, failed_removal in enumerate(items_not_removed, start=1):
            _preprocessor_logger.info(
                f'\t{i} {failed_removal["path"]} | Error: {failed_removal["error"]}')


def process_page(index_file: Path, deploy_env: str, docs: list, send_bouncer_home: bool) -> list[Path]:
    page_config = load_json_file(index_file)
    preprocessed_page_config = copy.deepcopy(page_config)
    all_filtered_pages_to_remove = []
    try:
        page_items = page_config.json_object.get('items', [])
        filtered_items, filtered_pages_to_remove = filter_by_env(
            deploy_env, page_config.dir, page_items, docs)
        preprocessed_page_config.json_object['items'] = filtered_items
        all_filtered_pages_to_remove += filtered_pages_to_remove

        selector = page_config.json_object.get('selector')
        if selector:
            selector_items = selector.get('items', [])
            filtered_selector_items, filtered_selector_pages_to_remove = filter_by_env(
                deploy_env, page_config.dir, selector_items, docs)
            preprocessed_page_config.json_object['selector']['items'] = filtered_selector_items
            all_filtered_pages_to_remove += filtered_selector_pages_to_remove
    except Exception as e:
        if not send_bouncer_home:
            raise e
        _preprocessor_logger.warning(
            '**WATCH YOUR BACK: Bouncer is home, errors got inside.**')
        page_config.json_object[
            'title'] = f'{page_config.json_object["title"]} - PREPROCESSED WITH ERRORS! CHECK THE VALIDATOR LOG!'
    finally:
        write_json_object_to_file(preprocessed_page_config.json_object, preprocessed_page_config.absolute_path)
        return all_filtered_pages_to_remove


def process_pages(root_path: Path, deploy_env: str, docs: list, send_bouncer_home: bool):
    # This function removes page dirs
    # because the env property applies to the entire page dir, not only the page config file
    filtered_out_pages_to_remove = []
    for index_json_file in root_path.rglob('*.json'):
        _preprocessor_logger.info(f'Processing page {index_json_file}')
        filtered_out_pages_to_remove += process_page(index_json_file, deploy_env, docs, send_bouncer_home)

    unique_filtered_out_pages_to_remove = remove_duplicated_paths(filtered_out_pages_to_remove)
    removed_dirs, failed_removals = remove_page_dirs(unique_filtered_out_pages_to_remove)
    log_remove_operation_result(removed_dirs, failed_removals, 'Finished removing filtered out directories')


def clean_page(index_file: Path, send_bouncer_home: bool) -> list[Path]:
    page_config = load_json_file(index_file)
    cleaned_page_config = copy.deepcopy(page_config)
    all_empty_pages_to_remove = []
    try:
        page_items = page_config.json_object.get('items', [])
        items_with_no_refs_to_empty_pages, empty_pages_to_remove = find_refs_to_empty_pages(
            page_config.dir, page_items)
        items_with_no_empty_child_items = remove_items_with_empty_child_items(items_with_no_refs_to_empty_pages)
        cleaned_page_config.json_object['items'] = items_with_no_empty_child_items
        all_empty_pages_to_remove += empty_pages_to_remove

        selector = page_config.json_object.get('selector')
        if selector:
            selector_items = selector.get('items', [])
            selector_items_with_no_refs_to_empty_pages, empty_selector_pages_to_remove = find_refs_to_empty_pages(
                page_config.dir, selector_items)
            selector_items_with_no_empty_child_items = remove_items_with_empty_child_items(
                selector_items_with_no_refs_to_empty_pages)
            if selector_items_with_no_empty_child_items:
                cleaned_page_config.json_object['selector']['items'] = selector_items_with_no_empty_child_items
            else:
                del cleaned_page_config.json_object['selector']
            all_empty_pages_to_remove += empty_selector_pages_to_remove
    except Exception as e:
        if not send_bouncer_home:
            raise e
        _preprocessor_logger.warning(
            '**WATCH YOUR BACK: Bouncer is home, errors got inside.**')
        page_config.json_object[
            'title'] = f'{page_config.json_object["title"]} - PREPROCESSED WITH ERRORS! CHECK THE VALIDATOR LOG!'
    finally:
        write_json_object_to_file(cleaned_page_config.json_object, cleaned_page_config.absolute_path)
        return all_empty_pages_to_remove


def clean_pages(root_path: Path, send_bouncer_home: bool):
    # This function removes only page configs, not entire page dirs, because they may contain
    # other pages that are valid

    # Step 1
    empty_pages_to_remove = []
    for index_json_file in root_path.rglob('*.json'):
        _preprocessor_logger.info(f'Cleaning page {index_json_file}')
        empty_pages_to_remove += clean_page(index_json_file, send_bouncer_home)

    unique_empty_pages_to_remove = remove_duplicated_paths(empty_pages_to_remove)
    removed_configs_with_links, failed_removals_configs_with_links = remove_page_configs(unique_empty_pages_to_remove)
    log_remove_operation_result(removed_configs_with_links, failed_removals_configs_with_links,
                                'Finished removing linked empty pages')
    # Step 2
    pages_with_empty_items = find_empty_pages_without_links(root_path)
    unique_pages_with_empty_items = remove_duplicated_paths(pages_with_empty_items)
    removed_configs_with_no_links, failed_removals_configs_with_no_links = remove_page_configs(
        remove_duplicated_paths(unique_pages_with_empty_items))
    log_remove_operation_result(removed_configs_with_no_links, failed_removals_configs_with_no_links,
                                'Finished removing empty pages not linked from anywhere')


def run_preprocessor(send_bouncer_home: bool, deploy_env: str, pages_dir: Path, build_dir: Path,
                     docs_config_file: Path):
    docs = load_json_file(docs_config_file).json_object['docs']

    _preprocessor_logger.info('PROCESS STARTED: Preprocess pages')

    if build_dir.exists():
        shutil.rmtree(build_dir)

    shutil.copytree(pages_dir, build_dir)

    process_pages(build_dir, deploy_env, docs, send_bouncer_home)
    clean_pages(build_dir, send_bouncer_home)

    removed_dirs, failed_removals = remove_empty_dirs(build_dir, removed_dirs=[], failed_removals=[])
    log_remove_operation_result(removed_dirs, failed_removals, 'Finished removing empty directories')


_preprocessor_logger.info('PROCESS ENDED: Preprocess pages')
