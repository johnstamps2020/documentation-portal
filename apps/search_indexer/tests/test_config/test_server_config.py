import json
from pathlib import Path

root_dir = Path(__file__).parent.parent.parent.parent.parent
views_dir = root_dir / 'server' / 'views'

int_config_path = root_dir / '.teamcity' / 'config' / 'gw-docs-int.json'
staging_config_path = root_dir / '.teamcity' / 'config' / 'gw-docs-staging.json'
config_paths = [int_config_path, staging_config_path]


def load_json_file(file_path: Path()):
    with open(file_path, 'r') as config_file:
        return json.load(config_file)


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


def test_props_are_unique():
    def raise_exception_if_not_unique(values: list, prop_label):
        unique_values = []
        duplicates = []
        for item in values:
            if not item in unique_values:
                unique_values.append(item)
            else:
                duplicates.append(item)
        try:
            assert not duplicates
        except AssertionError:
            raise AssertionError(
                f'Found duplicate {prop_label}(s): {duplicates}')

    def test_props_are_unique_in_file(config_json: object):
        routes = [x.get('route') for x in config_json['pages']]
        raise_exception_if_not_unique(routes, 'route')

        ids = [x.get('id')
               for x in config_json['docs'] + config_json['sources']]
        raise_exception_if_not_unique(ids, 'id')

    def test_referenced_sources_exist(config_json: str):
        pass

    def test_if_is_compliant_with_schema(config_json: str):
        pass

    for path in config_paths:
        json = load_json_file(path)
        test_if_is_compliant_with_schema(json)
        test_props_are_unique_in_file(json)
        test_referenced_sources_exist(json)


def test_config_views_exist():
    missing_views = []
    for config_path in config_paths:
        config_json = load_json_file(config_path)
        page_config = config_json['pages']
        views_in_config = [x.get('view') for x in page_config]
        for view_in_config in views_in_config:
            path_to_view = views_dir / f'{view_in_config}.ejs'
            if not path_to_view.exists():
                missing_views.append(view_in_config)
    try:
        assert not missing_views
    except AssertionError:
        raise AssertionError(f'Missing some views: {missing_views}')
