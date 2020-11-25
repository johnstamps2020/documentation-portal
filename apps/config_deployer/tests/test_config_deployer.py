import filecmp
import json
import shutil
from pathlib import Path

import pytest

from config_deployer import main as config_deployer

current_dir = Path.absolute(Path(__file__)).parent
input_resources_path = current_dir / 'resources' / 'input'
expected_resources_path = current_dir / 'resources' / 'expected'
out_resources_path = current_dir / 'resources' / 'out'
server_config_path = Path('config', 'server-config.json')
cloud_taxonomies_path = Path('config', 'taxonomy', 'cloud')
cloud_taxonomies_index_path = Path('config', 'taxonomy', 'cloud', 'index.json')
server_configs_out_path = Path('config', 'server_config_files')


@pytest.fixture(scope='session', autouse=True)
def generate_server_configs():
    full_server_configs_out_path = out_resources_path / server_configs_out_path
    if full_server_configs_out_path.exists():
        shutil.rmtree(full_server_configs_out_path)
    deploy_envs = ['dev', 'int', 'staging', 'prod']
    for deploy_env in deploy_envs:
        config_deployer.save_json_file(
            full_server_configs_out_path / f'config_{deploy_env}.json',
            config_deployer.get_docs_for_env(input_resources_path / server_config_path, deploy_env)
        )


@pytest.fixture(scope='session', autouse=True)
def create_cloud_taxonomies_index():
    full_cloud_taxonomies_index_out_path = out_resources_path / cloud_taxonomies_index_path
    full_cloud_taxonomies_index_out_path.unlink(missing_ok=True)
    config_deployer.save_json_file(
        full_cloud_taxonomies_index_out_path,
        config_deployer.get_paths_index(input_resources_path / cloud_taxonomies_path)
    )


@pytest.fixture(scope='session')
def match_out_and_expected_files():
    matching_files_json_data = []
    for out_file in (out_resources_path / server_configs_out_path).iterdir():
        matching_expected_file = next(
            expected_file for expected_file in (expected_resources_path / server_configs_out_path).iterdir() if
            expected_file.name == out_file.name)
        with open(out_file) as of:
            out_file_json_data = json.load(of)
        with open(matching_expected_file) as mef:
            expected_file_json_data = json.load(mef)

        matching_files_json_data.append(
            (out_file_json_data, expected_file_json_data)
        )

    return matching_files_json_data


def test_out_dir_has_expected_server_configs():
    dir_comp = filecmp.dircmp(out_resources_path / server_configs_out_path,
                              expected_resources_path / server_configs_out_path)
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


def test_cloud_taxonomies_index_has_expected_paths():
    with open(expected_resources_path / cloud_taxonomies_index_path) as expected_index_file:
        expected_index_paths = json.load(expected_index_file)['paths']
    with open(out_resources_path / cloud_taxonomies_index_path) as out_index_file:
        out_index_paths = json.load(out_index_file)['paths']
    assert sorted(expected_index_paths) == sorted(out_index_paths)
