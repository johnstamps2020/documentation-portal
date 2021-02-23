import json
import logging
import re
import shutil
from dataclasses import dataclass
from typing import List, Dict
from flail_ssg import template_writer
from flail_ssg import logger

from pathlib import Path


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


def process_validation_results(mode: str, results: List):
    # hero - I'll take care of everything. If I notice a problem, I'll step in and stop you from getting into more trouble.
    # friend - I'll warn you about things that can hurt you but you're an adult and it's up to you what to do with the information

    if mode == 'hero':
        pass
    # Raise exception for errors
    elif mode == 'friend':
        pass
    # Don't raise exceptions, just log the issues


def doc_id_is_valid(doc_id: str):
    """Verify the doc ID does not start with "." or "/\""""
    regexp = re.compile("[^./].+")
    match = re.match(regexp, doc_id)
    return match


def env_settings_are_correct(item_envs: List, higher_order_envs: List):
    if not item_envs:
        return True
    if item_envs:
        if not higher_order_envs:
            return True
        elif all(env in higher_order_envs for env in item_envs):
            return True
    return False

# TODO: Add info about the file where the issues were found
def validate_page(index_file: Path,
                  docs: List,
                  envs: List,
                  validated_pages: List,
                  validation_results: List):
    def validate_items(items: List, parent_envs: List, issues: List):
        for item in items:
            if item.get('id'):
                item_id = item['id']
                if doc_id_is_valid(item_id):
                    matching_doc_object = next(
                        (doc for doc in docs if doc['id'] == item_id), None)
                    if matching_doc_object:
                        item_envs = matching_doc_object.get('environments')
                        if not env_settings_are_correct(item_envs, parent_envs):
                            issues.append(
                                IncorrectEnvSettingsWarning(details=f'\n\t\tItem label: {item["label"]}'
                                                                    f'\n\t\tItem ID: {item["id"]}'
                                                                    f'\n\t\tItem envs: {item_envs}'
                                                                    f'\n\t\tEnv settings of higher order elements: {parent_envs}'))
                    else:
                        issues.append(DocIdNotFoundError(details=item_id))
                else:
                    issues.append(InvalidDocIdError(details=item_id))
            elif item.get('page'):
                page_path = Path(page_dir / item['page'])
                if page_path.exists():
                    item_envs = item.get('env', [])
                    if not env_settings_are_correct(item_envs, parent_envs):
                        issues.append(
                            IncorrectEnvSettingsWarning(details=f'\n\t\tItem label: {item["label"]}'
                                                                f'\n\t\tItem page: {item["page"]}'
                                                                f'\n\t\tItem envs: {item_envs}'
                                                                f'\n\t\tEnv settings of higher order elements: {parent_envs}'))
                    new_parent_envs = parent_envs + item_envs
                    validate_page(page_path / 'index.json', docs, new_parent_envs, validated_pages, issues)
                else:
                    issues.append(PageNotFoundError(details=page_path))
            if item.get('items'):
                validate_items(item['items'], parent_envs, issues)
        return issues

    index_file_absolute = index_file.resolve()
    if index_file_absolute not in validated_pages:
        page_dir = index_file_absolute.parent
        validated_pages.append(index_file_absolute)
        index_json = json.load(index_file_absolute.open())

        page_items = index_json.get('items')
        if page_items:
            validate_items(page_items, envs, validation_results)
    return validation_results


def main():
    current_dir = Path(__file__).parent.resolve()
    pages_dir = current_dir.parent.parent / 'pages'
    config_file = current_dir.parent.parent.parent / '.teamcity' / 'config' / 'server-config.json'
    config_file_json = json.load(config_file.open())
    docs = config_file_json['docs']

    log_file = current_dir / 'validator.log'
    if log_file.exists():
        log_file.unlink()
    validator_logger = logger.create_logger('validator_logger')
    logger.configure_logger(validator_logger, 'info', log_file)
    validator_logger.info('PROCESS STARTED: Generate pages')

    cloud_products_validation = validate_page(
        pages_dir / 'cloudProducts' / 'index.json',
        docs,
        envs=[],
        validated_pages=[],
        validation_results=[]
    )
    self_managed_products_validation = validate_page(
        pages_dir / 'selfManagedProducts' / 'index.json',
        docs,
        envs=[],
        validated_pages=[],
        validation_results=[]
    )
    # TODO: Move this logic to the function processing results
    validator_logger.info(f'Issues found:')
    for error in sorted(cloud_products_validation + self_managed_products_validation, key=lambda e: e.message):
        validator_logger.error(f'\t{error.message}: {error.details}')

    validator_logger.info('PROCESS ENDED: Validate pages')


main()
