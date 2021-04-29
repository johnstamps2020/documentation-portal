import shutil

import json
from collections import namedtuple
from pathlib import Path

import flail_ssg.validator
from flail_ssg.validator import run_validator
from flail_ssg.generator import filter_by_env
from jsonschema import validate as jsonschema_validate


class TestConfig:
    _current_dir = Path(__file__).parent
    _frontend_dir = _current_dir.parent.parent
    send_bouncer_home = False
    pages_dir = _frontend_dir / 'pages'
    docs_config_file = _frontend_dir.parent / '.teamcity' / 'config' / 'server-config.json'
    page_schema_file = _frontend_dir / 'page-schema.json'
    resources_input_dir = _current_dir / 'resources' / 'input'
    resources_expected_dir = _current_dir / 'resources' / 'expected'


def load_json_file(file_path: Path):
    file_path_absolute = file_path.resolve()
    return json.load(file_path_absolute.open())


def test_filtering_by_env():
    docs = load_json_file(TestConfig.resources_input_dir / 'config' / 'server-config.json')['docs']
    input_items = load_json_file(TestConfig.resources_input_dir / 'selfManagedProducts' / 'index.json')['items']
    expected_items = load_json_file(TestConfig.resources_expected_dir / 'selfManagedProducts' / 'index.json')['items']

    tmp_test_dir = TestConfig.resources_input_dir / 'tmpTestDir'
    shutil.copytree(TestConfig.resources_input_dir / 'selfManagedProducts',
                    tmp_test_dir, dirs_exist_ok=True)

    filtered_items = filter_by_env(deploy_env='staging',
                                   current_page_dir=tmp_test_dir,
                                   items=input_items,
                                   docs=docs)
    shutil.rmtree(tmp_test_dir)
    assert filtered_items == expected_items


def test_all_pages_are_valid():
    run_validator(TestConfig.send_bouncer_home,
                  TestConfig.pages_dir,
                  TestConfig.docs_config_file)


def test_all_pages_are_valid_with_schema():
    page_schema_json = load_json_file(TestConfig.page_schema_file)
    for index_json_file in TestConfig.pages_dir.rglob('**/*.json'):
        index_json = load_json_file(index_json_file)
        jsonschema_validate(instance=index_json, schema=page_schema_json)


def test_env_settings_are_correct():
    EnvSettings = namedtuple('EnvSettings', 'parent_element_envs item_envs')
    correct_settings = [
        EnvSettings(['dev', 'int', 'staging', 'prod'], ['dev', 'int', 'staging', 'prod']),
        EnvSettings(['dev', 'int', 'staging', 'prod'], ['dev', 'staging', 'prod']),
        EnvSettings(['dev', 'staging', 'prod'], ['staging', 'prod']),
        EnvSettings(['staging', 'prod'], ['prod']),
        EnvSettings(['dev', 'int', 'staging', 'prod'], ['dev']),
        EnvSettings([], ['dev']),
        EnvSettings(['dev', 'int', 'staging', 'prod'], []),
        EnvSettings([], []),
    ]
    incorrect_settings = [
        EnvSettings(['prod'], ['int', 'prod']),
        EnvSettings(['prod'], ['int']),
        EnvSettings(['dev', 'staging', 'prod'], ['int']),
        EnvSettings(['dev', 'staging'], ['int', 'prod']),
        EnvSettings(['staging'], ['dev', 'int']),
        EnvSettings(['dev', 'staging'], ['staging', 'prod']),
    ]
    for i in correct_settings:
        assert flail_ssg.validator.env_settings_are_correct(
            higher_order_envs=i[0], item_envs=i[1]) is True

    for i in incorrect_settings:
        assert flail_ssg.validator.env_settings_are_correct(
            higher_order_envs=i[0], item_envs=i[1]) is False
