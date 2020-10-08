import filecmp
import json
import shutil
from pathlib import Path

import pytest

from config_deployer import main as config_deployer

current_dir = Path.absolute(Path(__file__)).parent
config_path = current_dir / 'resources' / 'input' / 'config' / 'server-config.json'
out_dir = current_dir / 'resources' / 'out'
expected_dir = current_dir / 'resources' / 'expected'


@pytest.fixture(scope='session', autouse=True)
def generate_configs():
    if out_dir.exists():
        shutil.rmtree(out_dir)
    deploy_envs = ['dev', 'int', 'staging', 'prod']
    for deploy_env in deploy_envs:
        config_deployer.save_config_for_env(
            out_dir / f'config_{deploy_env}.json',
            config_deployer.get_docs_for_env(config_path, deploy_env)
        )


@pytest.fixture(scope='session')
def match_out_and_expected_files():
    matching_files_json_data = []
    for out_file in out_dir.iterdir():
        matching_expected_file = next(
            expected_file for expected_file in expected_dir.iterdir() if expected_file.name == out_file.name)
        with open(out_file) as of:
            out_file_json_data = json.load(of)
        with open(matching_expected_file) as mef:
            expected_file_json_data = json.load(mef)

        matching_files_json_data.append(
            (out_file_json_data, expected_file_json_data)
        )

    return matching_files_json_data


def test_out_dir_has_expected_files():
    dir_comp = filecmp.dircmp(out_dir, expected_dir)
    assert dir_comp.left_list == dir_comp.right_list


def test_docs_element(match_out_and_expected_files):
    def test_number_of_docs_in_files():
        for json_data_pair in match_out_and_expected_files:
            assert len(json_data_pair[0]['docs']) == len(json_data_pair[1]['docs'])

    def test_all_docs_are_included_in_files():
        for json_data_pair in match_out_and_expected_files:
            for out_doc in json_data_pair[0]['docs']:
                assert any(out_doc == exp_doc for exp_doc in json_data_pair[1]['docs'])

    test_number_of_docs_in_files()
    test_all_docs_are_included_in_files()


def test_product_families_element(match_out_and_expected_files):
    def test_number_of_product_families():
        for json_data_pair in match_out_and_expected_files:
            assert len(json_data_pair[0]['productFamilies']) == len(json_data_pair[1]['productFamilies'])

    def test_all_product_families_are_included_in_files():
        for json_data_pair in match_out_and_expected_files:
            for out_product_family in json_data_pair[0]['productFamilies']:
                assert any(out_product_family == exp_product_family for exp_product_family in
                           json_data_pair[1]['productFamilies'])

    test_number_of_product_families()
    test_all_product_families_are_included_in_files()
