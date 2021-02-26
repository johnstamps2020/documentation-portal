import json
import shutil
from typing import List
from flail_ssg import logger

from pathlib import Path

_log_file = Path.cwd() / 'generator.log'
_generator_logger = logger.configure_logger('generator_logger', 'info', _log_file)


def include_item(env: str, item_envs: List):
    if not item_envs:
        return True
    elif env in item_envs:
        return True
    return False


def create_breadcrumbs(page_dir: Path, build_dir: Path):
    if page_dir == build_dir:
        return None
    breadcrumbs = []
    path = ''
    for parent in sorted(page_dir.parents, key=lambda p: page_dir.parents.index(p), reverse=True):
        if (parent / 'index.json').exists() and parent != build_dir:
            parent_title = json.load((parent / 'index.json').open())['title']
            path += f'/{parent.name}'
            breadcrumbs.append(
                {
                    'label': parent_title,
                    'path': path
                }
            )

    return breadcrumbs


def get_siblings(page_dir: Path):
    siblings = []
    for path in page_dir.parent.iterdir():
        index_json = path / 'index.json'
        if path.is_dir() and index_json.exists() and path != page_dir:
            sibling_json = json.load(index_json.open())
            siblings.append(
                {
                    'label': sibling_json['title'],
                    'path': path.name
                }
            )
    return sorted(siblings, key=lambda s: s['label'])


def filter_by_env(deploy_env: str, current_page_dir: Path, items: List, docs: List):
    for item in items:
        if item.get('id'):
            matching_doc_object = next(
                (doc for doc in docs if doc['id'] == item['id']), None)
            item_envs = matching_doc_object['environments']
        else:
            item_envs = item.get('env', [])
        if not include_item(deploy_env, item_envs):
            if item.get('page'):
                shutil.rmtree(current_page_dir / item['page'])
            items.remove(item)
        if item.get('items'):
            filter_by_env(deploy_env, current_page_dir, item['items'], docs)
    return items


def resolve_links(items: List, docs: List):
    for item in items:
        if item.get('id'):
            matching_doc_object = next(
                (doc for doc in docs if doc['id'] == item['id']), None)
            item['id'] = f'/{matching_doc_object["url"]}'
    return items


def process_page(index_file: Path,
                 deploy_env: str,
                 docs: List,
                 build_dir: Path):
    index_file_absolute = index_file.resolve()
    page_dir = index_file_absolute.parent
    index_json = json.load(index_file_absolute.open())
    index_json['current_page'] = {
        'label': index_json['title'],
        'path': page_dir.name
    }
    index_json['siblings'] = get_siblings(page_dir)
    index_json['breadcrumbs'] = create_breadcrumbs(page_dir, build_dir)

    page_items = index_json.get('items')
    if page_items:
        filtered_items = filter_by_env(deploy_env, page_dir, page_items, docs)
        items_with_resolved_links = resolve_links(filtered_items, docs)
        index_json['items'] = items_with_resolved_links
    json.dump(index_json, index_file_absolute.open('w'), indent=2)


def run_generator(send_bouncer_home: bool, deploy_env: str, pages_dir: Path, build_dir: Path,
                  docs_config_file: Path):
    config_file_json = json.load(docs_config_file.open())
    docs = config_file_json['docs']

    _generator_logger.info('PROCESS STARTED: Generate pages')

    if build_dir.exists():
        shutil.rmtree(build_dir)

    shutil.copytree(pages_dir, build_dir)

    for index_json_file in build_dir.rglob('**/*.json'):
        try:
            _generator_logger.info(f'Generating page from {index_json_file}')
            process_page(index_json_file, deploy_env, docs, build_dir)
        except Exception as e:
            if send_bouncer_home:
                _generator_logger.warning('**WATCH YOUR BACK: Bouncer is home, errors got inside.**')
            else:
                raise e

    _generator_logger.info('PROCESS ENDED: Generate pages')
