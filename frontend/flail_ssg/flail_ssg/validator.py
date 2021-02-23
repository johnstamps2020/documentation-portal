import json
import logging
import re
from dataclasses import dataclass
from typing import List, Dict
from flail_ssg import logger

from pathlib import Path
from itertools import groupby


@dataclass
class InvalidDocIdError:
    config_file: Path
    details: str
    level: int = logging.ERROR
    message: str = 'Invalid doc ID'


@dataclass
class DocIdNotFoundError:
    config_file: Path
    details: str
    level: int = logging.ERROR
    message: str = 'Doc ID not found'


@dataclass
class PageNotFoundError:
    config_file: Path
    details: str
    level: int = logging.ERROR
    message: str = 'Page not found'


@dataclass
class IncorrectEnvSettingsWarning:
    config_file: Path
    details: str
    level: int = logging.WARNING
    message: str = 'Env settings incorrect'


def process_validation_results(results: List, func_logger: logging.Logger, bouncer_mode=False):
    """
    bouncer_mode:
        If I notice any errors, I'll raise hell right away!
    """

    def group_and_sort_results(raw_results: List, group_key: str, sort_key: str):
        grouped_results = groupby(raw_results, key=lambda r: getattr(r, group_key))
        sorted_results = [(key, sorted(group, key=lambda r: getattr(r, sort_key))) for (key, group) in grouped_results]
        return sorted_results

    for config_file, file_issues in group_and_sort_results(results, 'config_file', 'message'):
        func_logger.info(f'{config_file}')
        for issue_type, issues in group_and_sort_results(file_issues, 'message', 'details'):
            formatted_details = "".join(
                [
                    "".join([f'\n\t\t{line}' for line in i.details.splitlines()])
                    for i in issues
                ]
            )
            func_logger.info(f'\t{issue_type}: '
                             f'{formatted_details}')
    if bouncer_mode:
        errors = [issue for issue in results if issue.level == logging.ERROR]
        if errors:
            raise SyntaxError('Validation failed with errors!'
                              f'\nTotal number of errors: {len(errors)}')


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


def validate_page(index_file: Path,
                  docs: List,
                  envs: List,
                  validated_pages: List,
                  validation_results: List):
    def validate_items(page_config_file: Path, page_items: List, parent_envs: List, issues: List):
        for item in page_items:
            if item.get('id'):
                item_id = item['id']
                if doc_id_is_valid(item_id):
                    matching_doc_object = next(
                        (doc for doc in docs if doc['id'] == item_id), None)
                    if matching_doc_object:
                        item_envs = matching_doc_object.get('environments')
                        if not env_settings_are_correct(item_envs, parent_envs):
                            issues.append(
                                IncorrectEnvSettingsWarning(
                                    config_file=page_config_file,
                                    details=f'Item label: {item["label"]} '
                                            f'Item ID: {item["id"]} | '
                                            f'Item envs: {item_envs} | '
                                            f'Env settings of higher order elements: {parent_envs}'
                                )
                            )
                    else:
                        issues.append(DocIdNotFoundError(
                            config_file=page_config_file,
                            details=item_id)
                        )
                else:
                    issues.append(InvalidDocIdError(
                        config_file=page_config_file,
                        details=item_id)
                    )
            elif item.get('page'):
                page_path = Path(page_config_file.parent / item['page'])
                if page_path.exists():
                    item_envs = item.get('env', [])
                    if not env_settings_are_correct(item_envs, parent_envs):
                        issues.append(
                            IncorrectEnvSettingsWarning(
                                config_file=page_config_file,
                                details=f'Item label: {item["label"]} '
                                        f'Item page: {item["page"]} | '
                                        f'Item envs: {item_envs} | '
                                        f'Env settings of higher order elements: {parent_envs}'
                            )
                        )
                    new_parent_envs = parent_envs + item_envs
                    validate_page(page_path / 'index.json', docs, new_parent_envs, validated_pages, issues)
                else:
                    issues.append(PageNotFoundError(
                        config_file=page_config_file,
                        details=str(page_path)))
            if item.get('items'):
                validate_items(page_config_file, item['items'], parent_envs, issues)
        return issues

    index_file_absolute = index_file.resolve()
    if index_file_absolute not in validated_pages:
        validated_pages.append(index_file_absolute)
        index_json = json.load(index_file_absolute.open())

        items = index_json.get('items')
        if items:
            validate_items(index_file_absolute, items, envs, validation_results)
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

    cloud_products_validation_results = validate_page(
        pages_dir / 'cloudProducts' / 'index.json',
        docs,
        envs=[],
        validated_pages=[],
        validation_results=[]
    )
    self_managed_products_validation_results = validate_page(
        pages_dir / 'selfManagedProducts' / 'index.json',
        docs,
        envs=[],
        validated_pages=[],
        validation_results=[]
    )

    process_validation_results(cloud_products_validation_results + self_managed_products_validation_results,
                               validator_logger)

    validator_logger.info('PROCESS ENDED: Validate pages')


main()
