import filecmp
import json
import shutil
from pathlib import Path

import pytest

from lion_page_builder import main as lion_page_builder

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
    full_server_configs_out_path.mkdir(exist_ok=True, parents=True)
    deploy_envs = ['dev', 'int', 'staging', 'prod']
    for deploy_env in deploy_envs:
        config_deployer.save_json_file(
            full_server_configs_out_path / f'config_{deploy_env}.json',
            config_deployer.get_docs_for_env(
                input_resources_path / server_config_path, deploy_env)
        )


@pytest.fixture(scope='session', autouse=True)
def create_cloud_taxonomies_index():
    full_cloud_taxonomies_out_path = out_resources_path / cloud_taxonomies_path
    if full_cloud_taxonomies_out_path.exists():
        shutil.rmtree(full_cloud_taxonomies_out_path)
    full_cloud_taxonomies_out_path.mkdir(exist_ok=True, parents=True)
    deploy_envs = ['dev', 'int', 'staging', 'prod']
    for deploy_env in deploy_envs:
        docs_for_env = config_deployer.get_docs_for_env(
            input_resources_path / server_config_path, deploy_env)
        releases = config_deployer.get_releases_from_docs(docs_for_env)
        cloud_taxonomy_files_paths = config_deployer.get_paths_index(
            input_resources_path / cloud_taxonomies_path,
            releases
        )
        config_deployer.save_json_file(
            full_cloud_taxonomies_out_path / f'index_{deploy_env}.json',
            cloud_taxonomy_files_paths
        )


@pytest.fixture(scope='session')
def match_out_and_expected_files(request):
    matching_files_json_data = []
    for out_file in (out_resources_path / request.param).iterdir():
        matching_expected_file = next(
            expected_file for expected_file in (expected_resources_path / request.param).iterdir() if
            expected_file.name == out_file.name)
        with open(out_file) as of:
            out_file_json_data = json.load(of)
        with open(matching_expected_file) as mef:
            expected_file_json_data = json.load(mef)

        matching_files_json_data.append(
            (out_file_json_data, expected_file_json_data)
        )

    return matching_files_json_data


# Test server configs
def test_out_dir_has_expected_server_configs():
    dir_comp = filecmp.dircmp(out_resources_path / server_configs_out_path,
                              expected_resources_path / server_configs_out_path)
    assert dir_comp.left_list == dir_comp.right_list


@pytest.mark.parametrize("match_out_and_expected_files", [server_configs_out_path], indirect=True)
def test_docs_element(match_out_and_expected_files):
    def test_number_of_docs_in_files():
        for json_data_pair in match_out_and_expected_files:
            assert len(json_data_pair[0]['docs']) == len(
                json_data_pair[1]['docs'])

    def test_all_docs_are_included_in_files():
        for json_data_pair in match_out_and_expected_files:
            for out_doc in json_data_pair[0]['docs']:
                assert any(
                    out_doc == exp_doc for exp_doc in json_data_pair[1]['docs'])

    test_number_of_docs_in_files()
    test_all_docs_are_included_in_files()


# Test cloud taxonomy index files
def test_out_dir_has_expected_taxonomy_indices():
    dir_comp = filecmp.dircmp(out_resources_path / cloud_taxonomies_path,
                              expected_resources_path / cloud_taxonomies_path)
    assert dir_comp.left_list == dir_comp.right_list


@pytest.mark.parametrize("match_out_and_expected_files", [cloud_taxonomies_path], indirect=True)
def test_paths_element(match_out_and_expected_files):
    def test_number_of_paths_in_files():
        for json_data_pair in match_out_and_expected_files:
            assert len(json_data_pair[0]['paths']) == len(
                json_data_pair[1]['paths'])

    def test_all_releases_are_included_in_files():
        for json_data_pair in match_out_and_expected_files:
            for out_index_file in json_data_pair[0]['paths']:
                assert any(
                    out_index_file == exp_index_file for exp_index_file in json_data_pair[1]['paths'])

    test_number_of_paths_in_files()
    test_all_releases_are_included_in_files()
