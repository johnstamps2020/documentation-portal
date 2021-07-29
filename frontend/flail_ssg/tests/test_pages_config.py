import os
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
    docs_config_file = Path(os.environ['DOCS_CONFIG_FILE'])
    pages_dir = _frontend_dir / 'pages'
    page_schema_file = _frontend_dir / 'page-schema.json'
    resources_input_dir = _current_dir / 'resources' / 'input'
    resources_expected_dir = _current_dir / 'resources' / 'expected'


def load_json_file(file_path: Path):
    file_path_absolute = file_path.resolve()
    return json.load(file_path_absolute.open())


def test_filtering_by_env():
    docs = load_json_file(TestConfig.resources_input_dir / 'config' / 'docs' / 'docs.json')['docs']
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
