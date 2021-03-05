import json
import shutil
from typing import List
from flail_ssg import logger

from pathlib import Path

_log_file = Path.cwd() / 'generator.log'
_generator_logger = logger.configure_logger(
    'generator_logger', 'info', _log_file)


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
                page_path = current_page_dir / item['page']
                if page_path.exists():
                    # FIXME: The empty parent dir is not deleted. For example, when we have explore/latest and latest
                    # FIXME: contains index.json and explore is empty, only latest is deleted
                    shutil.rmtree(page_path)
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
            filtered_items = filter_by_env(
                deploy_env, page_dir, page_items, docs)
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
            _generator_logger.warning(
                '**WATCH YOUR BACK: Bouncer is home, errors got inside.**')
            index_json['title'] = f'{index_json["title"]} - GENERATED WITH ERRORS! CHECK THE VALIDATOR LOG!'
        else:
            raise e
    finally:
        json.dump(index_json, index_file_absolute.open('w'), indent=2)


def mark_public_on_page(page_path: Path, any_doc_or_page_is_public: bool, docs: List):
    def mark_items_as_public(page_items: List, marked_any_item_as_public: bool):
        for item in page_items:
            item_id = item.get('id')
            item_page_ref = item.get('page')
            if item_id:
                matching_doc_object = next(
                    (doc for doc in docs if doc['id'] == item_id), None)
                item_is_public = matching_doc_object['public']
                item['public'] = item_is_public
                if item_is_public:
                    marked_any_item_as_public = True
            elif item_page_ref:
                subpage_path = Path(page_path.parent /
                                    item_page_ref / 'index.json')
                marked_any_item_as_public = mark_public_on_page(
                    subpage_path, marked_any_item_as_public, docs)
                item['public'] = marked_any_item_as_public
            inner_items = item.get('items')
            if inner_items:
                inner_items, marked_any_item_as_public = mark_items_as_public(
                    inner_items, marked_any_item_as_public)
        return page_items, marked_any_item_as_public

    try:
        file_json = json.load(page_path.open())
        items = file_json.get('items')
        if items:
            file_json['items'], any_doc_or_page_is_public = mark_items_as_public(
                items, any_doc_or_page_is_public)
            json.dump(file_json, page_path.open('w'), indent=2)
        return any_doc_or_page_is_public
    except Exception as e:
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
    top_index_file_path = list(build_dir.rglob('**/*.json'))[0]
    # FIXME: mark public on page after we filter out environments
    mark_public_on_page(top_index_file_path, False, docs)
    _generator_logger.info('SUBPROCESS ENDED: Mark pages as public')

    for index_json_file in build_dir.rglob('**/*.json'):
        _generator_logger.info(f'Generating page from {index_json_file}')
        process_page(index_json_file, deploy_env, docs,
                     build_dir, send_bouncer_home)

    _generator_logger.info('PROCESS ENDED: Generate pages')
