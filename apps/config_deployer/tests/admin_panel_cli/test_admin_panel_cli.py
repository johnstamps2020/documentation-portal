import argparse
import filecmp
from pathlib import Path

import pytest

import config_deployer.main as config_deployer

current_dir = Path.absolute(Path(__file__)).parent


def check_dirs_have_the_same_files(args):
    dir_comp = filecmp.dircmp(args.out_dir,
                              args.expected_path)

    assert dir_comp.left_list == dir_comp.right_list


def check_files_have_the_same_content(args):
    for output_file in args.out_dir.glob('*.json'):
        for expected_file in args.expected_path.glob('*.json'):
            if output_file.name == expected_file.name:
                _, output_items = config_deployer.get_root_object(output_file)
                _, expected_items = config_deployer.get_root_object(expected_file)
                assert output_items == expected_items


def check_created_files(args):
    for output_file in args.out_dir.glob('*.json'):
        for expected_file in args.expected_path.glob('*.json'):
            if output_file.name == expected_file.name:
                _, output_items = config_deployer.get_root_object(output_file)
                for item in output_items:
                    assert item['id'].startswith(args.id_prefix)
                    item['id'] = args.id_prefix
                _, expected_items = config_deployer.get_root_object(expected_file)
                for item in expected_items:
                    item['id'] = args.id_prefix
                assert output_items == expected_items


def create_test_args():
    args_create = argparse.Namespace()
    args_create.command = 'create'
    args_create.type = 'docs'
    args_create.number_of_items = 5
    args_create.id_prefix = 'doc'
    args_create.out_dir = current_dir / args_create.command / 'out'
    args_create.expected_path = current_dir / args_create.command / 'expected'

    args_merge = argparse.Namespace()
    args_merge.command = 'merge'
    args_merge.src_path = current_dir / args_merge.command / 'input'
    args_merge.out_dir = current_dir / args_merge.command / 'out'
    args_merge.expected_path = current_dir / args_merge.command / 'expected'

    args_deploy = argparse.Namespace()
    args_deploy.command = 'deploy'
    args_deploy.deploy_env = 'int'
    args_deploy.src_path = current_dir / args_deploy.command / 'input'
    args_deploy.out_dir = current_dir / args_deploy.command / 'out'
    args_deploy.expected_path = current_dir / args_deploy.command / 'expected'

    args_split_by_chunk = argparse.Namespace()
    args_split_by_chunk.command = 'split'
    args_split_by_chunk.chunk_size = 10
    args_split_by_chunk.src_path = current_dir / args_split_by_chunk.command / 'input' / 'docs.json'
    args_split_by_chunk.out_dir = current_dir / args_split_by_chunk.command / 'out' / 'chunk'
    args_split_by_chunk.expected_path = current_dir / args_split_by_chunk.command / 'expected' / 'chunk'

    args_split_by_prop_name = argparse.Namespace()
    args_split_by_prop_name.command = 'split'
    args_split_by_prop_name.chunk_size = None
    args_split_by_prop_name.prop_name = 'metadata.product'
    args_split_by_prop_name.src_path = current_dir / args_split_by_prop_name.command / 'input' / 'docs.json'
    args_split_by_prop_name.out_dir = current_dir / args_split_by_prop_name.command / 'out' / 'prop_name'
    args_split_by_prop_name.expected_path = current_dir / args_split_by_prop_name.command / 'expected' / 'prop_name'

    args_remove = argparse.Namespace()
    args_remove.command = 'remove'
    args_remove.prop_name = 'metadata.product'
    args_remove.prop_value = 'BillingCenter'
    args_remove.src_path = current_dir / args_remove.command / 'input' / 'docs.json'
    args_remove.out_dir = current_dir / args_remove.command / 'out'
    args_remove.expected_path = current_dir / args_remove.command / 'expected'

    args_update_by_prop_value = argparse.Namespace()
    args_update_by_prop_value.command = 'update'
    args_update_by_prop_value.prop_name = 'public'
    args_update_by_prop_value.prop_value = 'false'
    args_update_by_prop_value.new_prop_value = 'true'
    args_update_by_prop_value.src_path = current_dir / args_update_by_prop_value.command / 'input' / 'docs.json'
    args_update_by_prop_value.out_dir = current_dir / args_update_by_prop_value.command / 'out' / 'prop_value'
    args_update_by_prop_value.expected_path = current_dir / args_update_by_prop_value.command / 'expected' / 'prop_value'

    args_update_all = argparse.Namespace()
    args_update_all.command = 'update'
    args_update_all.prop_name = 'metadata.product'
    args_update_all.prop_value = ''
    args_update_all.new_prop_value = 'BillingCenter Cloud BETA'
    args_update_all.src_path = current_dir / args_update_all.command / 'input' / 'docs.json'
    args_update_all.out_dir = current_dir / args_update_all.command / 'out' / 'all'
    args_update_all.expected_path = current_dir / args_update_all.command / 'expected' / 'all'

    args_extract = argparse.Namespace()
    args_extract.command = 'extract'
    args_extract.prop_name = 'metadata.product'
    args_extract.prop_value = 'BillingCenter'
    args_extract.src_path = current_dir / args_extract.command / 'input' / 'docs.json'
    args_extract.out_dir = current_dir / args_extract.command / 'out'
    args_extract.expected_path = current_dir / args_extract.command / 'expected'

    args_clone = argparse.Namespace()
    args_clone.command = 'clone'
    args_clone.prop_name = 'metadata.version'
    args_clone.prop_value = '9.0.10'
    args_clone.new_prop_value = '9.0.11'
    args_clone.src_path = current_dir / args_clone.command / 'input' / 'docs.json'
    args_clone.out_dir = current_dir / args_clone.command / 'out'
    args_clone.expected_path = current_dir / args_clone.command / 'expected'

    return [args_create, args_merge, args_deploy, args_split_by_chunk,
            args_split_by_prop_name, args_remove,
            args_extract, args_clone,
            args_update_by_prop_value,
            args_update_all]


@pytest.mark.parametrize('args', create_test_args())
def test_commands(args):
    config_deployer.run_command(args)
    check_dirs_have_the_same_files(args)
    if args.command == 'create':
        check_created_files(args)
    else:
        check_files_have_the_same_content(args)
