import json
import shutil
from typing import List
from flail_ssg import template_writer
from flail_ssg import logger

from pathlib import Path


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


def process_page(index_file: Path,
                 deploy_env: str,
                 docs: List,
                 build_dir: Path):
    def process_items(items: List):
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
            if item.get('items'):
                process_items(item['items'])
        return items

    index_file_absolute = index_file.resolve()
    page_dir = index_file_absolute.parent
    index_json = json.load(index_file_absolute.open())
    index_json['breadcrumbs'] = create_breadcrumbs(page_dir, build_dir)

    page_items = index_json.get('items')
    if page_items:
        index_json['items'] = process_items(page_items)
    json.dump(index_json, index_file_absolute.open('w'), indent=2)


def run_generator(deploy_env: str):
    current_dir = Path(__file__).parent.resolve()
    pages_dir = current_dir.parent.parent / 'pages'
    build_dir = current_dir / 'build'
    public_dir = current_dir.parent.parent.parent / 'server' / 'public'
    config_file = current_dir.parent.parent.parent / '.teamcity' / 'config' / 'server-config.json'
    config_file_json = json.load(config_file.open())
    docs = config_file_json['docs']
    templates_dir = current_dir.parent.parent / 'templates'

    log_file = current_dir / 'generator.log'
    if log_file.exists():
        log_file.unlink()
    generator_logger = logger.create_logger('generator_logger')
    logger.configure_logger(generator_logger, 'info', log_file)
    generator_logger.info('PROCESS STARTED: Generate pages')

    if build_dir.exists():
        shutil.rmtree(build_dir)

    shutil.copytree(pages_dir, build_dir)

    for index_json_file in build_dir.rglob('**/*.json'):
        generator_logger.info(f'Generating page from {index_json_file}')
        process_page(index_json_file, deploy_env, docs, build_dir)
        index_json = json.load(index_json_file.open())
        page_template = templates_dir / index_json['template']

        template_writer.write_to_file(
            index_json_file.parent / 'index.html',
            index_json,
            page_template
        )

    generator_logger.info('Removing JSON files')
    for index_json_file in build_dir.rglob('**/*.json'):
        index_json_file.unlink()

    shutil.copytree(build_dir, public_dir, dirs_exist_ok=True)
    generator_logger.info('PROCESS ENDED: Generate pages')
