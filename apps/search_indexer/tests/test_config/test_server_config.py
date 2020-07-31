import json
from pathlib import Path

from jsonschema import validate

root_dir = Path(__file__).parent.parent.parent.parent.parent

config_path = root_dir / '.teamcity' / 'config' / 'server-config.json'
sources_path = root_dir / '.teamcity' / 'config' / 'sources.json'
schema_path = root_dir / '.teamcity' / 'config' / 'config-schema.json'


def load_json_file(file_path: Path()):
    with open(file_path) as config_file:
        return json.load(config_file)


def test_config_exists():
    try:
        assert config_path.exists()
    except AssertionError:
        raise AssertionError(f'Cannot find the config file: {config_path}')


def test_config_is_valid():
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

    def props_are_unique_in_file(config_json: object, sources_json: object):
        ids = [x.get('id')
               for x in config_json['docs'] + sources_json['sources']]
        raise_exception_if_not_unique(ids, 'id')

    def referenced_sources_exist(config_json: str, sources_json: object):
        source_ids = [x.get('id') for x in sources_json['sources']]
        referenced_ids = []
        for doc in config_json['docs']:
            if doc.get('build', None):
                referenced_ids.append(doc['build']['src'])

        refs_to_missing_sources = []
        for referenced_id in referenced_ids:
            if not referenced_id in source_ids:
                refs_to_missing_sources.append(referenced_id)

        try:
            assert not refs_to_missing_sources
        except AssertionError:
            raise AssertionError(f'One or more builds reference missing source IDs: {refs_to_missing_sources}')

    def is_valid_with_schema(config_json: str):
        config_schema = load_json_file(schema_path)
        validate(instance=config_json, schema=config_schema)

    json_object = load_json_file(config_path)
    sources_object = load_json_file(sources_path)
    is_valid_with_schema(json_object)
    props_are_unique_in_file(json_object, sources_object)
    referenced_sources_exist(json_object, sources_object)
