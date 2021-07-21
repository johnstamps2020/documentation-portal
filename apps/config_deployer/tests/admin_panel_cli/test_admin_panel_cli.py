import filecmp
import json
from pathlib import Path


def load_json_file(json_file: Path):
    with open(json_file) as json_file:
        return json.load(json_file)


def check_dirs_have_the_same_files(left_dir: Path, right_dir: Path):
    dir_comp = filecmp.dircmp(left_dir,
                              right_dir)

    assert dir_comp.left_list == dir_comp.right_list


def check_files_have_the_same_content(output_dir: Path, expected_dir: Path, root_object_name: str):
    for output_file in output_dir.glob('*.json'):
        for expected_file in expected_dir.glob('*.json'):
            if output_file.name == expected_file.name:
                output_items = load_json_file(output_file)[root_object_name]
                expected_items = load_json_file(expected_file)[root_object_name]
                assert output_items == expected_items


def test_docs_merge():
    output_docs_configs = Path(
        '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/merge/output')

    expected_docs_configs = Path(
        '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/merge/expected')

    check_dirs_have_the_same_files(output_docs_configs, expected_docs_configs)
    check_files_have_the_same_content(output_docs_configs, expected_docs_configs, 'docs')


def test_docs_split():
    output_docs_configs = Path(
        '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/split/output')
    expected_docs_configs = Path(
        '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/split/expected')

    check_dirs_have_the_same_files(output_docs_configs, expected_docs_configs)
    check_files_have_the_same_content(output_docs_configs, expected_docs_configs, 'docs')


def test_docs_remove():
    output_docs_configs = Path(
        '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/remove/output')
    expected_docs_configs = Path(
        '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/remove/expected')

    check_dirs_have_the_same_files(output_docs_configs, expected_docs_configs)
    check_files_have_the_same_content(output_docs_configs, expected_docs_configs, 'docs')
