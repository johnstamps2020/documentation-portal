import os
import sys
import json
from pathlib import Path
local_modules_path = os.path.abspath(Path(__file__).parent.parent.parent)
sys.path.insert(0, local_modules_path)

import custom_utils.utils as custom_utils
root_dir = Path(__file__).parent.parent.parent.parent
dev_config_path = root_dir / '.teamcity' / 'config' / 'gw-docs-dev.json'
staging_config_path = root_dir / '.teamcity' / 'config' / 'gw-docs-staging.json'
config_paths = [dev_config_path, staging_config_path]

views_dir = root_dir / 'server' / 'views'


def load_json_file(file_path: Path()):
    with open(file_path, 'r') as config_file:
        return json.load(config_file)


def test_config_exists():
    missing_files = []
    for config_path in config_paths:
        if not os.path.exists(config_path):
            missing_files.append(config_path)
    try:
        assert len(missing_files) == 0
    except AssertionError:
        raise AssertionError(f'Cannot find config files\n{missing_files}')


def test_config_views_exist():
    missing_views = []
    for config_path in config_paths:
        config_json = load_json_file(config_path)
        views_in_config = [x.get('view') for x in config_json]
        for view_in_config in views_in_config:
            path_to_view = views_dir / f'{view_in_config}.ejs'
            if not os.path.exists(path_to_view):
                missing_views.append(view_in_config)
    try:
        assert len(missing_views) == 0
    except AssertionError:
        raise AssertionError(f'Missing some views: {missing_views}')


def test_routes_are_unique():
    def test_routes_are_unique_in_file(config_path: str):
        unique_routes = []
        config_json = load_json_file(config_path)
        routes = [x.get('route') for x in config_json]
        unique_routes = set(routes)
        try:
            assert len(routes) == len(unique_routes)
        except AssertionError:
            duplicates = [i for i, j in zip(
                sorted(routes), sorted(unique_routes)) if i != j]
            raise AssertionError(f'Found duplicate routes: {duplicates}')

    for config_path in config_paths:
        test_routes_are_unique_in_file(config_path)
