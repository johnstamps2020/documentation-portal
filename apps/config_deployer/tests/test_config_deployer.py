import filecmp
import shutil
from pathlib import Path

import pytest

import main as config_deployer

current_dir = Path.absolute(Path(__file__)).parent
config_path = current_dir / 'resources' / 'input' / 'config' / 'server-config.json'
out_dir = current_dir / 'resources' / 'out'
expected_dir = current_dir / 'resources' / 'expected'


@pytest.fixture(scope='session', autouse=True)
def generate_configs():
    shutil.rmtree(out_dir)
    deploy_envs = ['dev', 'int', 'staging', 'prod']
    for deploy_env in deploy_envs:
        config_deployer.save_config_for_env(
            out_dir / f'config_{deploy_env}.json',
            config_deployer.get_docs_for_env(config_path, deploy_env)
        )


def test_out_dir_has_expected_files():
    dir_comp = filecmp.dircmp(out_dir, expected_dir)
    assert dir_comp.left_list == dir_comp.right_list


def test_out_files_have_expected_content():
    for out_file in out_dir.iterdir():
        for expected_file in expected_dir.iterdir():
            if out_file.name == expected_file.name:
                assert filecmp.cmp(out_file, expected_file, shallow=False)

#TODO: Add a test for counting the number of docs in the config files
