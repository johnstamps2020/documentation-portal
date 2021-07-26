import argparse
import filecmp
from pathlib import Path

import pytest

import config_deployer.main as config_deployer

current_dir = Path.absolute(Path(__file__)).parent


def check_dirs_have_the_same_files(left_dir: Path, right_dir: Path):
    dir_comp = filecmp.dircmp(left_dir,
                              right_dir)

    assert dir_comp.left_list == dir_comp.right_list


# TODO: Get the root object name from the file, not from the param
def check_files_have_the_same_content(output_dir: Path, expected_dir: Path):
    for output_file in output_dir.glob('*.json'):
        for expected_file in expected_dir.glob('*.json'):
            if output_file.name == expected_file.name:
                _, output_items = config_deployer.get_root_object(output_file)
                _, expected_items = config_deployer.get_root_object(expected_file)
                assert output_items == expected_items


def create_test_args():
    args_create = argparse.Namespace()
    args_create.command = 'create'
    args_create.type = 'docs'
    args_create.number_of_items = 5
    args_create.id_prefix = 'doc'
    args_create.out_dir = current_dir / args_create.command / 'output'
    args_create.expected_path = current_dir / args_create.command / 'expected'

    args_merge = argparse.Namespace()
    args_merge.command = 'merge'
    args_merge.src_path = current_dir / args_merge.command / 'input'
    args_merge.out_dir = current_dir / args_merge.command / 'output'
    args_merge.expected_path = current_dir / args_merge.command / 'expected'

    args_deploy = argparse.Namespace()
    args_deploy.command = 'deploy'
    args_deploy.deploy_env = 'int'
    args_deploy.src_path = current_dir / args_deploy.command / 'input'
    args_deploy.out_dir = current_dir / args_deploy.command / 'output'
    args_deploy.expected_path = current_dir / args_deploy.command / 'expected'

    # TODO: Add two cases - split by chunk and prop name
    args_split = argparse.Namespace()

    args_remove = argparse.Namespace()
    args_remove.command = 'remove'
    args_remove.prop_name = 'metadata.product'
    args_remove.prop_value = 'BillingCenter'
    args_remove.src_path = current_dir / args_remove.command / 'input' / 'docs.json'
    args_remove.out_dir = current_dir / args_remove.command / 'output'
    args_remove.expected_path = current_dir / args_remove.command / 'expected'

    # TODO: Add two cases - update all and update only with specific prop name
    args_update = argparse.Namespace()

    args_extract = argparse.Namespace()

    args_clone = argparse.Namespace()

    return [args_create, args_merge, args_deploy, args_remove]


@pytest.mark.parametrize('args', create_test_args())
def test_commands(args):
    config_deployer.run_command(args)
    check_dirs_have_the_same_files(args.out_dir, args.expected_path)
    check_files_have_the_same_content(args.out_dir, args.expected_path)
