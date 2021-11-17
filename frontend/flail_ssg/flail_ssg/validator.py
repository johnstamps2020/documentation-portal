import logging
from dataclasses import dataclass
from pathlib import Path
from typing import List, Union

from itertools import groupby

from flail_ssg.helpers import configure_logger, load_json_file, PageConfig

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
class MissingItemError:
    config_file: Path
    details: str
    level: int = logging.ERROR
    message: str = 'Missing item'


@dataclass
class IncorrectEnvSettingsWarning:
    config_file: Path
    details: str
    level: int = logging.WARNING
    message: str = f'Incorrect env settings'


@dataclass
class IncompleteItemError:
    config_file: Path
    details: str
    level: int = logging.ERROR
    message: str = 'Item does not link to anything and does not contain any child items. ' \
                   'The item must have one of the following properties: "id", "page", "link", "items".'


def process_validation_results(results: List, send_bouncer_home: bool):
    """
    send_bouncer_home:
        When set to True, the bouncer raises hell right away if it notices any errors.
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


def env_settings_are_correct(envs: List, higher_order_envs: List, partial_match: bool = False):
    if not envs or not higher_order_envs:
        return True
    if partial_match:
        return any(env in higher_order_envs for env in envs)
    return all(env in higher_order_envs for env in envs)


def get_doc_object(id_element_value: str, docs_from_config: list) -> Union[dict, None]:
    return next(
        (doc for doc in docs_from_config if doc['id'] == id_element_value), None)


def validate_item_exists(item: dict, docs_from_config: list, page_config: PageConfig):
    if item.get('id'):
        item_id = item['id']
        doc_object_exists = bool(get_doc_object(item_id, docs_from_config))
        return doc_object_exists or DocIdNotFoundError(
            config_file=page_config.absolute_path,
            details=f'Item ID: {item_id}')
    elif item.get('page'):
        page_path = Path(page_config.dir / item['page'])
        return page_path.exists() or PageNotFoundError(
            config_file=page_config.absolute_path,
            details=f'Item page: {page_path}',
        )


def validate_item_is_complete(item: dict, page_config: PageConfig):
    item_has_ref = item.get('id') or item.get('page') or item.get('link')
    item_has_child_items = item.get('items')
    item_is_complete = bool(item_has_ref or item_has_child_items)
    return item_is_complete or IncompleteItemError(
        config_file=page_config.absolute_path,
        details=f'Item label: {item["label"]}'
    )


def validate_page(index_file: Path, docs: list):
    page_config = load_json_file(index_file)

    def validate_items(page_items: list, issues: list):
        for item in page_items:
            item_is_complete_result = validate_item_is_complete(item, page_config)
            if type(item_is_complete_result) is IncompleteItemError:
                issues.append(item_is_complete_result)
            else:
                item_exists_result = validate_item_exists(item, docs, page_config)
                if type(item_exists_result) in [DocIdNotFoundError, PageNotFoundError]:
                    issues.append(item_exists_result)
            if item.get('items'):
                validate_items(item['items'], issues)

        return issues

    def validate_page_has_redirect_link(page_items: list, issues: list):
        redirect_link = next((item for item in page_items if item.get('label', 'not found').casefold() == '_redirect'),
                             None)
        if not redirect_link:
            issues.append(MissingItemError(
                config_file=page_config.absolute_path,
                details='Redirect link not found. If you use the redirect template, the page items must contain'
                        ' the following item: { "label": "_redirect", "link": "redirectUrl"}.'
                        'For example, { "label": "_redirect", "link": "/cloudProducts/cortina"}'
            ))
        return issues

    validation_results = []
    page_template = page_config.json_object.get('template')
    items = page_config.json_object.get('items')
    if 'redirect'.casefold() in page_template.casefold():
        validate_page_has_redirect_link(items, validation_results)
    if items:
        validate_items(items, validation_results)
    selector = page_config.json_object.get('selector')
    if selector:
        selector_items = selector['items']
        validate_items(selector_items, validation_results)

    return validation_results


def validate_env_settings(index_file: Path,
                          docs: List,
                          envs: List,
                          validated_pages: List,
                          validation_results: List):
    page_config = load_json_file(index_file)

    def validate_item_envs(page_items: List, parent_envs: List, issues: List):
        for item in page_items:
            item_envs = item.get('env', [])
            item_label = item["label"]
            if item.get('id'):
                item_id = item['id']
                matching_doc_object = get_doc_object(item_id, docs)
                doc_config_envs = matching_doc_object.get('environments')
                if item_envs:
                    env_settings_correct = env_settings_are_correct(envs=item_envs,
                                                                    higher_order_envs=parent_envs) and \
                                           env_settings_are_correct(envs=item_envs,
                                                                    higher_order_envs=doc_config_envs)
                    if not env_settings_correct:
                        issues.append(
                            IncorrectEnvSettingsWarning(
                                config_file=page_config.absolute_path,
                                details=f'All item envs must be included in the parent envs AND in the doc config envs.'
                                        f'\nItem label: {item_label} | '
                                        f'Item ID: {item_id} | '
                                        f'Item envs: {item_envs} | '
                                        f'Parent envs: {parent_envs} | '
                                        f'Doc config envs: {doc_config_envs}'

                            )
                        )
                elif not item_envs:
                    env_settings_correct = env_settings_are_correct(envs=doc_config_envs,
                                                                    higher_order_envs=parent_envs,
                                                                    partial_match=True)
                    if not env_settings_correct:
                        issues.append(
                            IncorrectEnvSettingsWarning(
                                config_file=page_config.absolute_path,
                                details=f'At least one doc config env must be included in the parent envs.'
                                        f'\nItem label: {item_label} | '
                                        f'Item ID: {item_id} | '
                                        f'Parent envs: {parent_envs} | '
                                        f'Doc config envs: {doc_config_envs}'

                            )
                        )
            elif item.get('page'):
                item_page = item['page']
                page_path = Path(page_config.dir / item_page)
                if not env_settings_are_correct(envs=item_envs, higher_order_envs=parent_envs):
                    issues.append(
                        IncorrectEnvSettingsWarning(
                            config_file=page_config.absolute_path,
                            details=f'All item envs must be included in the parent envs. '
                                    f'\nItem label: {item_label} | '
                                    f'Item page: {item_page} | '
                                    f'Item envs: {item_envs} | '
                                    f'Envs of the parent element: {parent_envs}'
                        )
                    )
                new_parent_envs = item_envs or parent_envs
                validate_env_settings(page_path / 'index.json', docs,
                                      new_parent_envs, validated_pages, issues)
            else:
                if not env_settings_are_correct(envs=item_envs, higher_order_envs=parent_envs):
                    issues.append(
                        IncorrectEnvSettingsWarning(
                            config_file=page_config.absolute_path,
                            details=f'All item envs must be included in the parent envs. '
                                    f'\nItem label: {item_label} | '
                                    f'Item envs: {item_envs} | '
                                    f'Env settings of the parent element: {parent_envs}'
                        )
                    )

            if item.get('items'):
                new_parent_envs = item_envs or parent_envs
                validate_item_envs(item['items'], new_parent_envs, issues)

        return issues

    if page_config.absolute_path not in validated_pages:
        validated_pages.append(page_config.absolute_path)
        items = page_config.json_object.get('items')
        if items:
            validate_item_envs(items, envs, validation_results)

    return validation_results


def run_validator(send_bouncer_home: bool, pages_dir: Path, docs_config_file: Path):
    docs = load_json_file(docs_config_file).json_object['docs']

    _validator_logger.info('PROCESS STARTED: Validate pages')
    validation_results = []
    for index_json_file in pages_dir.rglob('**/*.json'):
        _validator_logger.info(f'Validating {index_json_file}')
        validation_results += validate_page(index_json_file, docs)

    _validator_logger.info('PROCESS ENDED: Validate pages')
    process_validation_results(validation_results, send_bouncer_home)

    # If errors are found after items are validated, the validator raises an exception and exits.
    # In this case, env settings are not be validated.

    _validator_logger.info('PROCESS STARTED: Validate env settings')
    envs_validation_results = validate_env_settings(
        pages_dir / 'index.json',
        docs,
        envs=[],
        validated_pages=[],
        validation_results=[]
    )

    _validator_logger.info('PROCESS ENDED: Validate env settings')
    process_validation_results(envs_validation_results, send_bouncer_home)
