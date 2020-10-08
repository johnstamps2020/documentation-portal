import json
from pathlib import Path
from typing import Dict

from jsonschema import validate

root_dir = Path(__file__).parent.parent.parent

server_config_path = root_dir / '.teamcity' / 'config' / 'server-config.json'
sources_path = root_dir / '.teamcity' / 'config' / 'sources.json'
builds_path = root_dir / '.teamcity' / 'config' / 'builds.json'
schema_path = root_dir / '.teamcity' / 'config' / 'config-schema.json'


def load_json_file(file_path: Path):
    with open(file_path) as config_file:
        return json.load(config_file)


def prop_is_unique_in_file(config_json: Dict, prop_label: str, root_node_label: str):
    prop_values = [x.get(prop_label) for x in config_json[root_node_label]]
    unique_values = []
    duplicates = []
    for prop_value in prop_values:
        if prop_value not in unique_values:
            unique_values.append(prop_value)
        else:
            duplicates.append(prop_value)
    try:
        assert not duplicates
    except AssertionError:
        raise AssertionError(
            f'Found duplicate {prop_label}(s): {duplicates}')


def referenced_sources_exist(builds_json: Dict, sources_json: Dict):
    source_ids = [source['id'] for source in sources_json['sources']]
    referenced_ids = [build['srcId'] for build in builds_json['builds']]

    refs_to_missing_sources = []
    for referenced_id in referenced_ids:
        if referenced_id not in source_ids:
            refs_to_missing_sources.append(referenced_id)

    try:
        assert not refs_to_missing_sources
    except AssertionError:
        raise AssertionError(f'One or more builds reference missing source IDs: {refs_to_missing_sources}')


def referenced_docs_exist(builds_json: Dict, config_json: Dict):
    doc_ids = [doc['id'] for doc in config_json['docs']]
    referenced_ids = [build['docId'] for build in builds_json['builds']]

    refs_to_missing_docs = []
    for referenced_id in referenced_ids:
        if referenced_id not in doc_ids:
            refs_to_missing_docs.append(referenced_id)

    try:
        assert not refs_to_missing_docs
    except AssertionError:
        raise AssertionError(f'One or more builds reference missing doc IDs: {refs_to_missing_docs}')


def is_valid_with_schema(config_json: Dict):
    config_schema = load_json_file(schema_path)
    validate(instance=config_json, schema=config_schema)


def test_config_files_exist():
    config_file_paths = [server_config_path, sources_path, builds_path]
    for config_file_path in config_file_paths:
        try:
            assert config_file_path.exists()
        except AssertionError:
            raise AssertionError(f'Cannot find the config file: {config_file_path}')


server_config_object = load_json_file(server_config_path)
sources_object = load_json_file(sources_path)
builds_object = load_json_file(builds_path)


def test_docs_config():
    is_valid_with_schema(server_config_object)
    prop_is_unique_in_file(server_config_object, 'id', 'docs')


def test_sources_config():
    is_valid_with_schema(sources_object)
    prop_is_unique_in_file(sources_object, 'id', 'sources')


def test_builds_config():
    is_valid_with_schema(builds_object)
    referenced_sources_exist(builds_object, sources_object)
    referenced_docs_exist(builds_object, server_config_object)
