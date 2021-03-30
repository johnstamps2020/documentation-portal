import logging
from dataclasses import dataclass
from pathlib import Path
from typing import List

from itertools import groupby

from flail_ssg.helpers import configure_logger, load_json_file

_log_file = Path.cwd() / 'validator.log'
_validator_logger = configure_logger('validator_logger', 'info', _log_file)


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
class ItemWithNoLinkError:
    config_file: Path
    details: str
    level: int = logging.ERROR
    message: str = 'Item does not link to anything. The item must have the "id", "page", or "link" property.'


@dataclass
class IncorrectEnvSettingsWarning:
    config_file: Path
    details: str
    level: int = logging.WARNING
    message: str = 'Env settings incorrect'


def process_validation_results(results: List, send_bouncer_home: bool):
    """
    bouncer_mode:
        If I notice any errors, I'll raise hell right away!
    """

    def group_and_sort_results(raw_results: List, group_key: str, sort_key: str = None):
        grouped_results = groupby(raw_results, key=lambda r: getattr(r, group_key))
        if sort_key:
            sorted_results = [
                (key, sorted(group, key=lambda r: getattr(r, sort_key)))
                for (key, group) in grouped_results
            ]
            return sorted_results
        return grouped_results

    for config_file, file_issues in group_and_sort_results(results, 'config_file'):
        _validator_logger.info(f'{config_file}')
        for issue_type, issues in group_and_sort_results(file_issues, 'message', 'details'):
            formatted_details = "".join(
                [
                    "".join(
                        [f'\n\t\t{line}' for line in i.details.splitlines()])
                    for i in issues
                ]
            )
            _validator_logger.info(f'\t{issue_type}: '
                                   f'{formatted_details}')
    if not send_bouncer_home:
        errors = [issue for issue in results if issue.level == logging.ERROR]
        if errors:
            raise SyntaxError('Validation failed with errors!'
                              f'\nTotal number of errors: {len(errors)}')


def env_settings_are_correct(item_envs: List, higher_order_envs: List):
    if not item_envs:
        return True
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
    page_config = load_json_file(index_file)

    def validate_items(page_items: List, parent_envs: List, issues: List):
        for item in page_items:
            item_envs = item.get('env', [])
            item_label = item["label"]
            if item.get('id'):
                item_id = item['id']
                matching_doc_object = next(
                    (doc for doc in docs if doc['id'] == item_id), None)
                if matching_doc_object and not item_envs:
                    item_envs = matching_doc_object.get('environments')
                elif not matching_doc_object:
                    issues.append(DocIdNotFoundError(
                        config_file=page_config.absolute_path,
                        details=f'Item ID: {item_id}')
                    )
                if not env_settings_are_correct(item_envs, parent_envs):
                    issues.append(
                        IncorrectEnvSettingsWarning(
                            config_file=page_config.absolute_path,
                            details=f'Item label: {item_label} '
                                    f'Item ID: {item_id} | '
                                    f'Item envs: {item_envs} | '
                                    f'Env settings of the parent element: {parent_envs}'
                        )
                    )
            elif item.get('page'):
                item_page = item['page']
                page_path = Path(page_config.dir / item_page)
                if page_path.exists():
                    if not env_settings_are_correct(item_envs, parent_envs):
                        issues.append(
                            IncorrectEnvSettingsWarning(
                                config_file=page_config.absolute_path,
                                details=f'Item label: {item_label} '
                                        f'Item page: {item_page} | '
                                        f'Item envs: {item_envs} | '
                                        f'Env settings of the parent element: {parent_envs}'
                            )
                        )
                    new_parent_envs = item_envs or parent_envs
                    validate_page(page_path / 'index.json', docs,
                                  new_parent_envs, validated_pages, issues)
                elif not page_path.exists():
                    issues.append(PageNotFoundError(
                        config_file=page_config.absolute_path,
                        details=f'Item page: {str(page_path)}'))
            else:
                if not env_settings_are_correct(item_envs, parent_envs):
                    issues.append(
                        IncorrectEnvSettingsWarning(
                            config_file=page_config.absolute_path,
                            details=f'Item label: {item_label} '
                                    f'Item envs: {item_envs} | '
                                    f'Env settings of the parent element: {parent_envs}'
                        )
                    )
            if item.get('items'):
                new_parent_envs = item_envs or parent_envs
                validate_items(item['items'], new_parent_envs, issues)
        return issues

    def validate_selector_items(selector_items: List, issues: List):
        for item in selector_items:
            item_label = item['label']
            if not (item.get('id') or item.get('page') or item.get('link')):
                issues.append(ItemWithNoLinkError(
                    config_file=page_config.absolute_path,
                    details=f'Selector item label: {item_label}'
                ))
            if item.get('id'):
                item_id = item['id']
                matching_doc_object = next(
                    (doc for doc in docs if doc['id'] == item_id), None)
                if not matching_doc_object:
                    issues.append(DocIdNotFoundError(
                        config_file=page_config.absolute_path,
                        details=f'Selector item ID: {item_id}')
                    )
            elif item.get('page'):
                item_page = item['page']
                page_path = Path(page_config.dir / item_page)
                if not page_path.exists():
                    issues.append(PageNotFoundError(
                        config_file=page_config.absolute_path,
                        details=f'Selector item page: {str(page_path)}'))
        return issues

    if page_config.absolute_path not in validated_pages:
        validated_pages.append(page_config.absolute_path)
        items = page_config.json_object.get('items')
        if items:
            validate_items(items, envs, validation_results)
        selector = page_config.json_object.get('selector')
        if selector:
            validate_selector_items(selector.get('items'), validation_results)
    return validation_results


def run_validator(send_bouncer_home: bool, pages_dir: Path, docs_config_file: Path):
    docs = load_json_file(docs_config_file).json_object['docs']

    _validator_logger.info('PROCESS STARTED: Validate pages')

    validation_results = validate_page(
        pages_dir / 'index.json',
        docs,
        envs=[],
        validated_pages=[],
        validation_results=[]
    )

    process_validation_results(validation_results, send_bouncer_home)

    _validator_logger.info('PROCESS ENDED: Validate pages')
