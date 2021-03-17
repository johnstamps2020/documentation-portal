import copy
import shutil
from pathlib import Path
from typing import List

from flail_ssg.helpers import configure_logger
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


def include_item(env: str, item_envs: List):
    if not item_envs:
        return True
    elif env in item_envs:
        return True
    return False


def filter_by_env(deploy_env: str, current_page_dir: Path, items: List, docs: List):
    filtered_items = []
    for item in items:
        if item.get('id'):
            matching_doc_object = next(
                (doc for doc in docs if doc['id'] == item['id']), None)
            item_envs = matching_doc_object['environments']
        else:
            item_envs = item.get('env', [])
        if not include_item(deploy_env, item_envs):
            if item.get('page'):
                page_path = current_page_dir / item['page']
                if page_path.exists():
                    shutil.rmtree(page_path)
        else:
            item_to_include = copy.deepcopy(item)
            if item_to_include.get('items'):
                inner_items = filter_by_env(
                    deploy_env, current_page_dir, item['items'], docs)
                item_to_include['items'] = inner_items
            filtered_items.append(item_to_include)
    return filtered_items


def resolve_links(items: List, docs: List):
    for item in items:
        if item.get('id'):
            matching_doc_object = next(
                (doc for doc in docs if doc['id'] == item['id']), None)
            item['doc_url'] = f'/{matching_doc_object["url"]}'
        if item.get('items'):
            resolve_links(item['items'], docs)
    return items


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
        _generator_logger.info(
            f'Removed empty directories: {len(removed_dirs)}/{len(empty_dirs)}')
        for i, removed_dir in enumerate(removed_dirs):
            _generator_logger.info(f'\t{i + 1} {removed_dir}')
    if failed_removals:
        _generator_logger.info(
            f'Failed to remove empty directories: {len(failed_removals)}/{len(empty_dirs)}')
        for i, failed_removal in enumerate(failed_removals):
            _generator_logger.info(
                f'\t{i + 1} {failed_removal["path"]} | Error: {failed_removal["error"]}')


def process_page(index_file: Path,
                 deploy_env: str,
                 docs: List,
                 build_dir: Path,
                 send_bouncer_home: bool):
    page_config = load_json_file(index_file)
    try:
        page_items = page_config.json_object.get('items')
        if page_items:
            filtered_items = filter_by_env(
                deploy_env, page_config.dir, page_items, docs)
            items_with_resolved_links = resolve_links(filtered_items, docs)
            page_config.json_object['items'] = items_with_resolved_links

        page_config.json_object['current_page'] = {
            'label': page_config.json_object['title'],
            'path': page_config.dir.name
        }
        page_config.json_object['breadcrumbs'] = create_breadcrumbs(page_config.dir, build_dir)
    except Exception as e:
        if send_bouncer_home:
            _generator_logger.warning(
                '**WATCH YOUR BACK: Bouncer is home, errors got inside.**')
            page_config.json_object[
                'title'] = f'{page_config.json_object["title"]} - GENERATED WITH ERRORS! CHECK THE VALIDATOR LOG!'
        else:
            raise e
    finally:
        write_json_object_to_file(page_config.json_object, page_config.absolute_path)


def run_generator(send_bouncer_home: bool, deploy_env: str, pages_dir: Path, build_dir: Path,
                  docs_config_file: Path):
    docs = load_json_file(docs_config_file).json_object['docs']

    _generator_logger.info('PROCESS STARTED: Generate pages')

    if build_dir.exists():
        shutil.rmtree(build_dir)

    shutil.copytree(pages_dir, build_dir)

    for index_json_file in build_dir.rglob('**/*.json'):
        _generator_logger.info(f'Generating page from {index_json_file}')
        process_page(index_json_file, deploy_env, docs,
                     build_dir, send_bouncer_home)

    remove_empty_dirs(build_dir)

    _generator_logger.info('PROCESS ENDED: Generate pages')
