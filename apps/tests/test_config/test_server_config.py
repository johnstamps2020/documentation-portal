import custom_utils.utils as custom_utils
import os
import sys
import json
import pytest
from pathlib import Path
local_modules_path = os.path.abspath(Path(__file__).parent.parent.parent)
sys.path.insert(0, local_modules_path)

root_dir = Path(__file__).parent.parent.parent.parent
views_dir = root_dir / 'server' / 'views'

dev_config_path = root_dir / '.teamcity' / 'config' / 'gw-docs-dev.json'
staging_config_path = root_dir / '.teamcity' / 'config' / 'gw-docs-staging.json'
config_paths = [dev_config_path, staging_config_path]


def test_config_exists():
    missing_files = []
    for config_path in config_paths:
        if not config_path.exists():
            missing_files.append(config_path)
    print(missing_files)
    try:
        assert not missing_files
    except AssertionError:
        raise AssertionError(f'Cannot find config files:\n    {missing_files}')


def test_config_views_exist():
    missing_views = []
    for config_path in config_paths:
        config_json = custom_utils.load_json_file(config_path)
        views_in_config = [x.get('view') for x in config_json]
        for view_in_config in views_in_config:
            path_to_view = views_dir / f'{view_in_config}.ejs'
            if not path_to_view.exists():
                missing_views.append(view_in_config)
    try:
        assert not missing_views
    except AssertionError:
        raise AssertionError(f'Missing some views: {missing_views}')


def test_routes_are_unique():
    def test_routes_are_unique_in_file(config_path: str):
        config_json = custom_utils.load_json_file(config_path)
        routes = [x.get('route') for x in config_json]
        unique_routes = set(routes)
        try:
            assert sorted(routes) == sorted(unique_routes)
        except AssertionError:
            duplicates = [i for i, j in zip(
                sorted(routes), sorted(unique_routes)) if i != j]
            raise AssertionError(f'Found duplicate route(s): {duplicates}')

    for config_path in config_paths:
        test_routes_are_unique_in_file(config_path)
