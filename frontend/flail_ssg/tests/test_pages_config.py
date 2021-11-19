import json
import json
import os
import shutil
from collections import namedtuple
from pathlib import Path

import pytest
from jsonschema import validate as jsonschema_validate

import flail_ssg.validator
from flail_ssg.generator import generate_search_filters
from flail_ssg.preprocessor import filter_by_env, remove_filtered_page_dirs
from flail_ssg.validator import DocIdNotFoundError, PageNotFoundError, run_validator, validate_env_settings, \
    validate_page


class TestConfig:
    _current_dir = Path(__file__).parent
    _frontend_dir = _current_dir.parent.parent
    send_bouncer_home = False
    docs_config_file = Path(os.environ['DOCS_CONFIG_FILE'])
    pages_dir = _frontend_dir / 'pages'
    page_schema_file = _frontend_dir / 'page-schema.json'
    resources_input_dir = _current_dir / 'resources' / 'input'
    resources_expected_dir = _current_dir / 'resources' / 'expected'
    incorrect_pages_dir = resources_input_dir / 'incorrect-pages'
    incorrect_pages_items_dir = incorrect_pages_dir / 'incorrect-items'
    incorrect_pages_env_settings_dir = incorrect_pages_dir / 'incorrect-env-settings'
    incorrect_pages_docs_config_file = incorrect_pages_dir / 'config.json'


def load_json_file(file_path: Path):
    file_path_absolute = file_path.resolve()
    return json.load(file_path_absolute.open())


def test_filtering_by_env():
    def test_filtering_items(filtered_items: list, filtered_pages_to_remove: list, expected_file: Path):
        expected_items = \
            load_json_file(expected_file)[
                'items']
        expected_filtered_pages_to_remove = [
            'dataHub/10.x',
            'infoCenter/10.x',
            'customerEngageAccountManagement/latest',
            'customerEngageAccountManagementCc/latest',
            'customerEngageQuoteAndBuy/latest',
            'producerEngage/latest',
            'producerEngageCc/latest',
            'serviceRepEngage/latest',
            'vendorEngage/latest'
        ]

        assert filtered_items == expected_items
        filtered_pages_to_remove_str = [str(p).replace(f'{tmp_test_dir}/', '') for p in filtered_pages_to_remove]
        assert len(filtered_pages_to_remove_str) == len(expected_filtered_pages_to_remove)
        assert sorted(filtered_pages_to_remove_str) == sorted(expected_filtered_pages_to_remove)

    def test_removing_filtered_out_pages(filtered_pages_to_remove: list, test_dir: Path):
        page_dirs_in_test_dir = [i for i in test_dir.rglob('*') if i.is_dir()]
        assert all(page_to_remove not in page_dirs_in_test_dir for page_to_remove in filtered_pages_to_remove)

    docs = load_json_file(TestConfig.resources_input_dir / 'config' / 'docs' / 'docs.json')['docs']
    input_items = load_json_file(TestConfig.resources_input_dir / 'pages' / 'selfManagedProducts' / 'index.json')[
        'items']
    tmp_test_dir = TestConfig.resources_input_dir / 'tmpTestDir'
    shutil.copytree(TestConfig.resources_input_dir / 'pages' / 'selfManagedProducts',
                    tmp_test_dir, dirs_exist_ok=True)

    items_after_filtering, pages_to_remove_after_filtering = filter_by_env(deploy_env='staging',
                                                                           current_page_dir=tmp_test_dir,
                                                                           items=input_items,
                                                                           docs=docs)
    remove_filtered_page_dirs(pages_to_remove_after_filtering)
    expected_output_dir = (TestConfig.resources_expected_dir / 'pages' / 'selfManagedProducts')
    test_filtering_items(items_after_filtering, pages_to_remove_after_filtering, expected_output_dir / 'index.json')
    test_removing_filtered_out_pages(pages_to_remove_after_filtering, tmp_test_dir)

    shutil.rmtree(tmp_test_dir)


def test_creating_search_filters():
    docs = load_json_file(TestConfig.resources_input_dir / 'config' / 'docs' / 'docs.json')['docs']
    input_dir = TestConfig.resources_input_dir / 'pages' / 'cloudProducts' / 'cortina' / 'policyCenterCloud'
    expected_dir = TestConfig.resources_expected_dir / 'pages' / 'cloudProducts' / 'cortina' / 'policyCenterCloud'
    for index_json_file in input_dir.rglob('*.json'):
        index_file_json = load_json_file(index_json_file)
        tmp_test_dir = TestConfig.resources_input_dir / 'tmpTestDir'
        shutil.copytree(input_dir, tmp_test_dir, dirs_exist_ok=True)

        search_filters = generate_search_filters(
            page_config_json=index_file_json,
            docs=docs)

        expected_index_json_file = Path(str(index_json_file).replace(str(input_dir), str(expected_dir)))
        expected_search_filters = load_json_file(expected_index_json_file).get('search_filters', {})
        assert search_filters == expected_search_filters
        shutil.rmtree(tmp_test_dir)


def test_all_pages_are_valid():
    run_validator(TestConfig.send_bouncer_home,
                  TestConfig.pages_dir,
                  TestConfig.docs_config_file)


@pytest.fixture(scope='module')
def load_docs_from_json():
    return load_json_file(TestConfig.incorrect_pages_docs_config_file)['docs']


def test_validation_for_incorrect_items(load_docs_from_json):
    docs = load_docs_from_json
    results = []
    for index_json_file in TestConfig.incorrect_pages_items_dir.rglob('*.json'):
        results += validate_page(index_json_file, docs)
    incorrect_ids = [r for r in results if type(r) is DocIdNotFoundError]
    incorrect_pages = [r for r in results if type(r) is PageNotFoundError]
    assert len(incorrect_ids) == 5
    assert len(incorrect_pages) == 4


def test_validation_for_incorrect_env_settings(load_docs_from_json):
    docs = load_docs_from_json
    all_validated_pages = []
    all_envs_validation_results = []
    for index_json_file in TestConfig.incorrect_pages_env_settings_dir.rglob('*.json'):
        envs_validation_results, validated_pages = validate_env_settings(
            index_json_file,
            docs,
            envs=[],
            validated_pages=all_validated_pages,
            validation_results=all_envs_validation_results,
        )
        all_envs_validation_results = envs_validation_results
        all_validated_pages = validated_pages
    assert len(all_envs_validation_results) == 5


def test_running_validator_for_incorrect_items():
    with pytest.raises(SyntaxError, match=r'.*errors.*9'):
        run_validator(TestConfig.send_bouncer_home,
                      TestConfig.incorrect_pages_items_dir,
                      TestConfig.incorrect_pages_docs_config_file)


def test_running_validator_for_incorrect_env_settings():
    with pytest.warns(SyntaxWarning, match=r'.*warnings.*5'):
        run_validator(TestConfig.send_bouncer_home,
                      TestConfig.incorrect_pages_env_settings_dir,
                      TestConfig.incorrect_pages_docs_config_file)


def test_all_pages_are_valid_with_schema():
    page_schema_json = load_json_file(TestConfig.page_schema_file)
    for index_json_file in TestConfig.pages_dir.rglob('*.json'):
        index_json = load_json_file(index_json_file)
        jsonschema_validate(instance=index_json, schema=page_schema_json)


def test_env_settings():
    def test_id_item_with_item_envs():
        EnvSettings = namedtuple('EnvSettings', 'parent_envs item_envs doc_config_envs')
        correct_settings = [
            EnvSettings(['dev', 'staging', 'prod'], ['dev', 'staging'], ['dev', 'staging', 'prod']),
            EnvSettings(['staging', 'prod'], ['staging'], ['dev', 'int', 'staging', 'prod']),
            EnvSettings([], ['int'], ['dev', 'int'])
        ]

        incorrect_settings = [
            EnvSettings(['dev', 'staging', 'prod'], ['dev', 'int', 'staging'], ['dev', 'int', 'staging', 'prod']),
            EnvSettings(['staging', 'prod'], ['prod'], ['dev', 'int', 'staging']),
            EnvSettings([], ['int'], ['dev', 'staging', 'prod'])
        ]

        for i in correct_settings:
            env_settings_correct = flail_ssg.validator.env_settings_are_correct(envs=i[1], higher_order_envs=i[0]) \
                                   and \
                                   flail_ssg.validator.env_settings_are_correct(envs=i[1], higher_order_envs=i[2])
            assert env_settings_correct is True

        for i in incorrect_settings:
            env_settings_correct = flail_ssg.validator.env_settings_are_correct(envs=i[1], higher_order_envs=i[0]) \
                                   and \
                                   flail_ssg.validator.env_settings_are_correct(envs=i[1], higher_order_envs=i[2])
            assert env_settings_correct is False

    def test_id_item_without_item_envs():
        EnvSettings = namedtuple('EnvSettings', 'parent_envs doc_config_envs')
        correct_settings = [
            EnvSettings(['dev', 'staging', 'prod'], ['dev', 'int', 'staging']),
            EnvSettings(['int'], ['dev', 'int', 'staging']),
            EnvSettings([], ['int'])
        ]

        incorrect_settings = [
            EnvSettings(['dev'], ['int']),
            EnvSettings(['dev', 'int'], ['staging', 'prod']),
            EnvSettings(['staging', 'prod'], ['dev', 'int'])
        ]

        for i in correct_settings:
            env_settings_correct = flail_ssg.validator.env_settings_are_correct(envs=i[1], higher_order_envs=i[0],
                                                                                partial_match=True)
            assert env_settings_correct is True

        for i in incorrect_settings:
            env_settings_correct = flail_ssg.validator.env_settings_are_correct(envs=i[1], higher_order_envs=i[0],
                                                                                partial_match=True)
            assert env_settings_correct is False

    def test_other_item():
        EnvSettings = namedtuple('EnvSettings', 'parent_envs item_envs')
        correct_settings = [
            EnvSettings(['dev', 'staging', 'prod'], ['dev', 'staging']),
            EnvSettings(['dev', 'int'], ['int'], ),
            EnvSettings([], ['dev']),
            EnvSettings(['staging', 'prod'], [])
        ]

        incorrect_settings = [
            EnvSettings(['dev'], ['int']),
            EnvSettings(['dev', 'int'], ['staging', 'prod']),
            EnvSettings(['staging', 'prod'], ['dev', 'int'])
        ]

        for i in correct_settings:
            env_settings_correct = flail_ssg.validator.env_settings_are_correct(envs=i[1], higher_order_envs=i[0])
            assert env_settings_correct is True

        for i in incorrect_settings:
            env_settings_correct = flail_ssg.validator.env_settings_are_correct(envs=i[1], higher_order_envs=i[0])
            assert env_settings_correct is False

    test_id_item_with_item_envs()
    test_id_item_without_item_envs()
    test_other_item()
