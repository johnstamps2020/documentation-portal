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
        if path.is_dir():
            index_json = path / 'index.json'
            if index_json.exists() and path != page_dir:
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
        if item.get('items'):
            resolve_links(item['items'], docs)
    return items


def mark_public_docs(items: List, docs: List):
    if items:
        for item in items:
            item_id = item.get('id')
            if item_id:
                matching_doc_object = next(
                    (doc for doc in docs if doc['id'] == item_id), None)
                if matching_doc_object:
                    doc_is_public = matching_doc_object.get('public')
                    if doc_is_public:
                        item['public'] = True
                    else:
                        item['public'] = False
            inner_items = item.get('items')
            if inner_items:
                item['items'] = mark_public_docs(
                    inner_items, docs)
    return items


def mark_public_on_page(file_json: Path, items: List):
    def get_public_prop_from_items(page_items: List):
        return [item.get('public') for item in page_items]

    page_contains_public_items = False
    if items:
        items_public_props = get_public_prop_from_items(items)
        for item in items:
            inner_items = item.get('items')
            if inner_items:
                items_public_props += get_public_prop_from_items(inner_items)

        if True in set(items_public_props):
            page_contains_public_items = True
    file_json['public'] = page_contains_public_items
    return file_json


def mark_public_paths():
    pass


def process_page(index_file: Path,
                 deploy_env: str,
                 docs: List,
                 build_dir: Path,
                 send_bouncer_home: bool):
    index_file_absolute = index_file.resolve()
    page_dir = index_file_absolute.parent
    index_json = json.load(index_file_absolute.open())
    try:
        page_items = index_json.get('items')
        if page_items:
            filtered_items = filter_by_env(deploy_env, page_dir, page_items, docs)
            items_with_resolved_links = resolve_links(filtered_items, docs)
            index_json['items'] = items_with_resolved_links

        index_json['current_page'] = {
            'label': index_json['title'],
            'path': page_dir.name
        }
        index_json['siblings'] = get_siblings(page_dir)
        index_json['breadcrumbs'] = create_breadcrumbs(page_dir, build_dir)
    except Exception as e:
        if send_bouncer_home:
            _generator_logger.warning('**WATCH YOUR BACK: Bouncer is home, errors got inside.**')
            index_json['title'] = f'{index_json["title"]} - GENERATED WITH ERRORS! CHECK THE VALIDATOR LOG!'
        else:
            raise e
    finally:
        json.dump(index_json, index_file_absolute.open('w'), indent=2)


def mark_public(index_file: Path, docs: list, allow_errors: bool, func_logger: any):
    try:
        index_file_absolute = index_file.resolve()
        index_json = json.load(index_file_absolute.open())
        items = index_json.get('items')
        marked_docs = mark_public_docs(items, docs)
        marked_index_json = mark_public_on_page(index_json, marked_docs)
        json.dump(marked_index_json, index_file_absolute.open('w'), indent=2)
    except Exception as e:
        if allow_errors:
            func_logger.warning(
                f'**WATCH YOUR BACK: The bouncer is home, so we are letting this one in {e}**')
        else:
            raise e


def run_generator(send_bouncer_home: bool, deploy_env: str, pages_dir: Path, build_dir: Path,
                  docs_config_file: Path):
    config_file_json = json.load(docs_config_file.open())
    docs = config_file_json['docs']

    _generator_logger.info('PROCESS STARTED: Generate pages')

    if build_dir.exists():
        shutil.rmtree(build_dir)

    shutil.copytree(pages_dir, build_dir)

    _generator_logger.info('SUBPROCESS STARTED: Mark pages as public')
    _generator_logger.info('SUBPROCESS ENDED: Mark pages as public')

    for index_json_file in build_dir.rglob('**/*.json'):
        _generator_logger.info(f'Generating page from {index_json_file}')
        mark_public(index_json_file, docs, send_bouncer_home, _generator_logger)
        process_page(index_json_file, deploy_env, docs, build_dir, send_bouncer_home)

    _generator_logger.info('PROCESS ENDED: Generate pages')
