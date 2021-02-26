import json
import shutil
from typing import List
from flail_ssg import template_writer
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


def process_page(index_file: Path,
                 deploy_env: str,
                 docs: List,
                 build_dir: Path,
                 send_bouncer_home: bool):
    def process_items(current_page_dir: Path, items: List, ignore_errors: bool):
        try:
            for item in items:
                if item.get('id'):
                    item_id = item['id']
                    matching_doc_object = next(
                        (doc for doc in docs if doc['id'] == item_id), None)
                    item_envs = matching_doc_object.get('environments')
                    if not include_item(deploy_env, item_envs):
                        items.remove(item)
                    else:
                        item['id'] = f'/{matching_doc_object["url"]}'
                elif item.get('page'):
                    item_envs = item.get('env', [])
                    if not include_item(deploy_env, item_envs):
                        items.remove(item)
                        shutil.rmtree(current_page_dir / item['page'])
                if item.get('items'):
                    process_items(current_page_dir, item['items'], ignore_errors)
            return items
        except Exception as e:
            if ignore_errors:
                _generator_logger.warning(f'Ignoring issue: {e}')
                return items
            raise e

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
        index_json['items'] = process_items(page_dir, page_items, send_bouncer_home)
    json.dump(index_json, index_file_absolute.open('w'), indent=2)


def run_generator(send_bouncer_home: bool, deploy_env: str, pages_dir: Path, templates_dir: Path, output_dir: Path,
                  docs_config_file: Path):
    current_dir = Path(__file__).parent.resolve()
    build_dir = current_dir / 'build'
    config_file_json = json.load(docs_config_file.open())
    docs = config_file_json['docs']

    _generator_logger.info('PROCESS STARTED: Generate pages')

    if build_dir.exists():
        shutil.rmtree(build_dir)

    shutil.copytree(pages_dir, build_dir)

    for index_json_file in build_dir.rglob('**/*.json'):
        _generator_logger.info(f'Generating page from {index_json_file}')
        process_page(index_json_file, deploy_env, docs, build_dir, send_bouncer_home)
        index_json = json.load(index_json_file.open())
        page_template = templates_dir / index_json['template']

        template_writer.write_to_file(
            index_json_file.parent / 'index.html',
            index_json,
            page_template
        )

    _generator_logger.info('Removing JSON files')
    for index_json_file in build_dir.rglob('**/*.json'):
        index_json_file.unlink()

    shutil.copytree(build_dir, output_dir, dirs_exist_ok=True)
    _generator_logger.info('PROCESS ENDED: Generate pages')
