import copy
import shutil
from pathlib import Path

from flail_ssg.helpers import configure_logger, get_doc_object, load_json_file, write_json_object_to_file

_log_file = Path.cwd() / 'preprocessor.log'
_preprocessor_logger = configure_logger(
    'preprocessor_logger', 'info', _log_file)


def include_item(env: str, item_envs: list):
    return not item_envs or env in item_envs


def filter_by_env(deploy_env: str, current_page_dir: Path, items: list, docs: list):
    filtered_items = []
    filtered_pages_to_remove = []
    for item in items:
        item_envs = item.get('env', [])
        if not item_envs and item.get('id'):
            matching_doc_object = get_doc_object(item['id'], docs)
            item_envs = matching_doc_object['environments']
        if include_item(deploy_env, item_envs):
            item_to_include = copy.deepcopy(item)
            if item_to_include.get('items'):
                inner_items, inner_pages_to_remove = filter_by_env(
                    deploy_env, current_page_dir, item['items'], docs)
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

    return filtered_items, filtered_pages_to_remove


def find_pages_without_items(root_path: Path):
    pages_without_items = []
    for index_json_file in root_path.rglob('*.json'):
        page_config = load_json_file(index_json_file)
        page_items = page_config.json_object.get('items')
        if not page_items:
            pages_without_items.append(index_json_file)
    return pages_without_items


def remove_filtered_page_dirs(pages_to_remove: list[Path]):
    for page_path in pages_to_remove:
        if page_path.exists():
            shutil.rmtree(page_path)


def remove_empty_dirs(root_path: Path):
    removed_dirs = []
    failed_removals = []
    empty_dirs = [p for p in root_path.rglob(
        '*') if p.is_dir() and not list(p.iterdir())]
    for empty_dir in empty_dirs:
        try:
            empty_dir.rmdir()
            removed_dirs.append(empty_dir)
        except Exception as e:
            failed_removals.append(
                {'path': empty_dir,
                 'error': e}
            )

    if removed_dirs:
        _preprocessor_logger.info(
            f'Removed empty directories: {len(removed_dirs)}/{len(empty_dirs)}')
        for i, removed_dir in enumerate(removed_dirs, start=1):
            _preprocessor_logger.info(f'\t{i} {removed_dir}')
    if failed_removals:
        _preprocessor_logger.info(
            f'Failed to remove empty directories: {len(failed_removals)}/{len(empty_dirs)}')
        for i, failed_removal in enumerate(failed_removals, start=1):
            _preprocessor_logger.info(
                f'\t{i} {failed_removal["path"]} | Error: {failed_removal["error"]}')


def preprocess_page(index_file: Path,
                    deploy_env: str,
                    docs: list,
                    send_bouncer_home: bool):
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


def run_preprocessor(send_bouncer_home: bool, deploy_env: str, pages_dir: Path, build_dir: Path,
                     docs_config_file: Path):
    docs = load_json_file(docs_config_file).json_object['docs']

    _preprocessor_logger.info('PROCESS STARTED: Preprocess pages')

    if build_dir.exists():
        shutil.rmtree(build_dir)

    shutil.copytree(pages_dir, build_dir)

    all_pages_to_remove = []
    for index_json_file in build_dir.rglob('*.json'):
        _preprocessor_logger.info(f'Preprocessing page {index_json_file}')
        all_pages_to_remove += preprocess_page(index_json_file, deploy_env, docs, send_bouncer_home)

    remove_filtered_page_dirs(all_pages_to_remove)
    pages_with_empty_items = find_pages_without_items(build_dir)
    for page in pages_with_empty_items:
        page.unlink()
    remove_empty_dirs(build_dir)
    _preprocessor_logger.info('PROCESS ENDED: Preprocess pages')
