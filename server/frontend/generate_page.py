import copy

import json
import shutil
from jinja2 import Environment
from jinja2 import FileSystemLoader
from pathlib import Path
from typing import Dict, List

CURRENT_DIR = Path(__file__).parent
PAGES_DIR = CURRENT_DIR / 'pages'
TEMPLATES_DIR = CURRENT_DIR / 'templates'
BUILD_DIR = CURRENT_DIR / 'build'
CONFIG_FILE = CURRENT_DIR.parent.parent / '.teamcity' / 'config' / 'server-config.json'


def write_to_file(out_file_path: Path, data: Dict, template_file: Path):
    jinja2_environment = Environment(
        loader=FileSystemLoader(template_file.parent),
        trim_blocks=True,
        lstrip_blocks=True,
        keep_trailing_newline=False,
        optimized=True,
        autoescape=False,
        auto_reload=True
    )
    jinja2_template = jinja2_environment.get_template(template_file.name)
    content = jinja2_template.render(
        data=data
    )

    out_file_path.parent.mkdir(exist_ok=True)

    new_file = out_file_path.open('w')
    new_file.write(content)


if BUILD_DIR.exists():
    shutil.rmtree(BUILD_DIR)

shutil.copytree(PAGES_DIR, BUILD_DIR)

config_file = json.load(CONFIG_FILE.open())
docs = config_file['docs']


def convert_id_to_url(items: List):
    converted_items = copy.deepcopy(items)
    for item in converted_items:
        if item.get('id'):
            matching_doc_object = next(doc for doc in docs if doc['id'] == item['id'])
            item['id'] = f'/{matching_doc_object["url"]}'
        if item.get('items'):
            item['items'] = convert_id_to_url(item['items'])
    return converted_items


for json_file in BUILD_DIR.rglob('**/*.json'):
    json_data = json.load(json_file.open())
    page_title = json_data['title']
    page_template = TEMPLATES_DIR / json_data['template']
    page_items = convert_id_to_url(json_data['items'])

    write_to_file(
        json_file.parent / 'index.html',
        {
            'title': page_title,
            'items': page_items
        },
        page_template
    )
