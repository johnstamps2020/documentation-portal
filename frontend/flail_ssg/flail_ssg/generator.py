import json
import logging
import re
import shutil
from dataclasses import dataclass
from typing import List, Dict
from flail_ssg import template_writer
from flail_ssg import logger

from pathlib import Path

CURRENT_DIR = Path(__file__).parent.resolve()


@dataclass
class InvalidDocIdError:
    details: str
    level: int = logging.ERROR
    message: str = 'Invalid doc ID'


@dataclass
class DocIdNotFoundError:
    details: str
    level: int = logging.ERROR
    message: str = 'Doc ID not found'


@dataclass
class PageNotFoundError:
    details: str
    level: int = logging.ERROR
    message: str = 'Page not found'


@dataclass
class IncorrectEnvSettingsWarning:
    details: str
    level: int = logging.WARNING
    message: str = 'Env settings incorrect'


def doc_id_is_valid(doc_id: str):
    """Verify the doc ID does not start with "." or "/\""""
    regexp = re.compile("[^./].+")
    match = re.match(regexp, doc_id)
    return match


def include_item(env: str, item_envs: List):
    if not item_envs:
        return True
    elif env in item_envs:
        return True
    return False


# Test if env settings are correct
def env_settings_are_correct(item_envs: List, higher_order_envs: List):
    if not item_envs:
        return True
    if item_envs:
        if not higher_order_envs:
            return True
        elif all(env in higher_order_envs for env in item_envs):
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
                 build_dir: Path,
                 func_logger: logging.Logger,
                 parent_envs: List,
                 processed_pages=None):
    if not processed_pages:
        processed_pages = []
    errors = []

    def process_items(items: List):
        for item in items:
            if item.get('id'):
                item_id = item['id']
                if doc_id_is_valid(item_id):
                    matching_doc_object = next(
                        (doc for doc in docs if doc['id'] == item_id), None)
                    if matching_doc_object:
                        item_envs = matching_doc_object.get('environments')
                        if not env_settings_are_correct(item_envs, parent_envs):
                            errors.append(IncorrectEnvSettingsWarning(details=f'\n\t\tItem label: {item["label"]}'
                                                                              f'\n\t\tItem ID: {item["id"]}'
                                                                              f'\n\t\tItem envs: {item_envs}'
                                                                              f'\n\t\tEnv settings of higher order elements: {parent_envs}'))
                        if include_item(deploy_env, item_envs):
                            item['id'] = f'/{matching_doc_object["url"]}'
                        else:
                            items.remove(item)
                    else:
                        errors.append(DocIdNotFoundError(details=item_id))
                else:
                    errors.append(InvalidDocIdError(details=item_id))
            elif item.get('page'):
                page_path = Path(page_dir / item['page'])
                if page_path.exists():
                    item_envs = item.get('env', [])
                    if not env_settings_are_correct(item_envs, parent_envs):
                        errors.append(IncorrectEnvSettingsWarning(details=f'\n\t\tItem label: {item["label"]}'
                                                                          f'\n\t\tItem page: {item["page"]}'
                                                                          f'\n\t\tItem envs: {item_envs}'
                                                                          f'\n\t\tEnv settings of higher order elements: {parent_envs}'))
                    if include_item(deploy_env, item_envs):
                        new_parent_envs = parent_envs + item_envs
                        process_page(page_path / 'index.json', deploy_env, docs, build_dir, func_logger,
                                     new_parent_envs,
                                     processed_pages)
                    else:
                        items.remove(item)
                else:
                    errors.append(PageNotFoundError(details=page_path))
            if item.get('items'):
                process_items(item['items'])
        return items

    index_file_absolute = index_file.resolve()
    if index_file_absolute not in processed_pages:
        page_dir = index_file_absolute.parent
        func_logger.info(f'Processing {index_file_absolute}')
        processed_pages.append(index_file_absolute)
        index_json = json.load(index_file_absolute.open())
        index_json['breadcrumbs'] = create_breadcrumbs(page_dir, build_dir)

        page_items = index_json.get('items')
        if page_items:
            index_json['items'] = process_items(page_items)
        json.dump(index_json, index_file_absolute.open('w'), indent=2)
        if errors:
            func_logger.info(f'Issues found:')
            for error in sorted(errors, key=lambda e: e.message):
                func_logger.error(f'\t{error.message}: {error.details}')


def generate_pages(deploy_env: str):
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

    process_page(build_dir / 'index.json', deploy_env, docs, build_dir, generator_logger, [])

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
    generator_logger.info('PROCESS ENDED: Generate pages')
