import json
from pathlib import Path

from flail_ssg.validator import run_validator
from typing import Dict
from jsonschema import validate as jsonschema_validate


class TestConfig:
    _frontend_dir = Path(__file__).parent.parent.parent
    send_bouncer_home = False
    pages_dir = _frontend_dir / 'pages'
    docs_config_file = _frontend_dir.parent / '.teamcity' / 'config' / 'server-config.json'
    page_schema_file = _frontend_dir / 'page-schema.json'


def load_json_file(file_path: Path):
    file_path_absolute = file_path.resolve()
    return json.load(file_path_absolute.open())


def test_all_pages_are_valid():
    run_validator(TestConfig.send_bouncer_home,
                  TestConfig.pages_dir,
                  TestConfig.docs_config_file)


def test_all_pages_are_valid_with_schema():
    page_schema_json = load_json_file(TestConfig.page_schema_file)
    for index_json_file in TestConfig.pages_dir.rglob('**/*.json'):
        index_json = load_json_file(index_json_file)
        jsonschema_validate(instance=index_json, schema=page_schema_json)
