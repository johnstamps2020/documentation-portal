import filecmp
import json
from pathlib import Path


def load_json_file(json_file: Path):
    with open(json_file) as json_file:
        return json.load(json_file)


def test_docs_merge():
    output_docs_config = next(Path(
        '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/merge/output').glob(
        '*.json'))
    output_docs = load_json_file(output_docs_config)['docs']
    expected_docs_config = next(Path(
        '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/merge/expected').glob(
        '*.json'))
    expected_docs = load_json_file(expected_docs_config)['docs']

    assert output_docs == expected_docs


def test_docs_split():
    output_docs_configs = Path(
        '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/split/output')
    expected_docs_configs = Path(
        '/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/tests/admin_panel_cli/split/expected')

    def test_output_dir_has_expected_configs():
        dir_comp = filecmp.dircmp(output_docs_configs,
                                  expected_docs_configs)

        assert dir_comp.left_list == dir_comp.right_list

    def test_configs_have_expected_data():
        for output_config_file in output_docs_configs.glob('*.json'):
            for expected_config_file in expected_docs_configs.glob('*.json'):
                if output_config_file.name == expected_config_file.name:
                    output_docs = load_json_file(output_config_file)['docs']
                    expected_docs = load_json_file(expected_config_file)['docs']
                    assert output_docs == expected_docs

    test_output_dir_has_expected_configs()
    test_configs_have_expected_data()
