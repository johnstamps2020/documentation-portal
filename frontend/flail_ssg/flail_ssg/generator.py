import json
import logging
import shutil
from typing import List, Dict
from flail_ssg import template_writer
from flail_ssg import logger

from pathlib import Path

CURRENT_DIR = Path(__file__).parent.resolve()


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


def process_page(index_file: Path, docs: List, build_dir: Path, logger: logging.Logger):
    errors = {
        'missing_pages': [],
        'missing_doc_ids': []
    }
    page_dir = index_file.parent
    logger.info(f'Processing {index_file}')
    index_json = json.load(index_file.open())
    index_json['breadcrumbs'] = create_breadcrumbs(page_dir, build_dir)

    def process_items(items: List):
        for item in items:
            item_envs = []
            if item.get('id'):
                matching_doc_object = next(
                    (doc for doc in docs if doc['id'] == item['id']), None)
                if matching_doc_object:
                    item_envs = matching_doc_object['environments']
                    item['id'] = f'/{matching_doc_object["url"]}'
                else:
                    errors['missing_doc_ids'].append(item['id'])
            elif item.get('page'):
                item_envs = item.get('env')
                page_path = Path(page_dir / item['page'])
                if page_path.exists():
                    process_page(page_path / 'index.json', docs, build_dir, logger)
                else:
                    errors['missing_pages'].append(page_path)
            if item.get('items'):
                process_items(item['items'])
        return items

    page_items = index_json.get('items')
    if page_items:
        index_json['items'] = process_items(page_items)
    json.dump(index_json, index_file.open('w'), indent=2)
    for missing_page in errors['missing_pages']:
        logger.error(f'No page found: {missing_page}')
    for missing_doc_id in errors['missing_doc_ids']:
        logger.error(f'No doc ID found: {missing_doc_id}')


def generate_pages():
    current_dir = Path(__file__).parent.resolve()
    pages_dir = current_dir.parent.parent / 'pages'
    build_dir = current_dir / 'build'
    public_dir = current_dir.parent.parent.parent / 'server' / 'public'
    config_file = CURRENT_DIR.parent.parent.parent / '.teamcity' / 'config' / 'server-config.json'
    config_file = json.load(config_file.open())
    docs = config_file['docs']
    templates_dir = CURRENT_DIR.parent.parent / 'templates'

    log_file = current_dir / 'generator.log'
    if log_file.exists():
        log_file.unlink()
    generator_logger = logger.create_logger('generator_logger')
    logger.configure_logger(generator_logger, 'info', log_file)
    generator_logger.info('PROCESS STARTED: Generate pages')

    if build_dir.exists():
        shutil.rmtree(build_dir)

    shutil.copytree(pages_dir, build_dir)

    process_page(build_dir / 'index.json', docs, build_dir, generator_logger)

    for index_json_file in build_dir.rglob('**/*.json'):
        index_json = json.load(index_json_file.open())
        page_template = templates_dir / index_json['template']

        template_writer.write_to_file(
            index_json_file.parent / 'index.html',
            index_json,
            page_template
        )

        index_json_file.unlink()

    shutil.copytree(build_dir, public_dir, dirs_exist_ok=True)
