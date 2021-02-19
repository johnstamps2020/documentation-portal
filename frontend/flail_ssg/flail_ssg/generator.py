import copy
import json
import shutil
from typing import List
from flail_ssg.template_writer import write_to_file
from pathlib import Path

CURRENT_DIR = Path(__file__).parent.resolve()


def create_breadcrumbs(page_dir: Path, build_dir: Path):
    if page_dir == build_dir:
        return None
    parents_names = [parent.name for parent in page_dir.parents if
                     (parent / 'index.json').exists() and parent != build_dir][::-1]
    breadcrumbs = Path('/', '/'.join(parents_names))
    return str(breadcrumbs)


def process_page(index_file: Path, docs: List, build_dir: Path):
    page_dir = index_file.parent
    print(f'Processed {index_file}')
    index_json = json.load(index_file.open())
    index_json['breadcrumbs'] = create_breadcrumbs(page_dir, build_dir)
    print(index_json['breadcrumbs'])
    page_items = index_json.get('items')

    if page_items:
        converted_items = copy.deepcopy(page_items)
        for item in converted_items:
            if item.get('id'):
                matching_doc_object = next(
                    (doc for doc in docs if doc['id'] == item['id']), None)
                if matching_doc_object:
                    doc_envs = matching_doc_object['environments']
                    item['id'] = f'/{matching_doc_object["url"]}'
                else:
                    print(f'NO MATCHING ID FOR {item["id"]}')
            elif item.get('page'):
                page_path = Path(page_dir / item['page'])
                if page_path.exists():
                    process_page(page_path / 'index.json', docs, build_dir)
                else:
                    print(f'PAGE PATH DOES NOT EXIST: {page_path}')
            elif item.get('items'):
                # FIXME: Need to convert nested items recursively
                item['items'] = item['items']
        index_json['items'] = converted_items
    json.dump(index_json, index_file.open('w'), indent=2)


def generate_pages():
    current_dir = Path(__file__).parent.resolve()
    pages_dir = current_dir.parent.parent / 'pages'
    build_dir = current_dir / 'build'
    public_dir = current_dir.parent.parent.parent / 'server' / 'public'
    config_file = CURRENT_DIR.parent.parent.parent / '.teamcity' / 'config' / 'server-config.json'
    config_file = json.load(config_file.open())
    docs = config_file['docs']
    templates_dir = CURRENT_DIR.parent.parent / 'templates'

    if build_dir.exists():
        shutil.rmtree(build_dir)

    shutil.copytree(pages_dir, build_dir)

    process_page(build_dir / 'index.json', docs, build_dir)

    for index_json_file in build_dir.rglob('**/*.json'):
        index_json = json.load(index_json_file.open())
        page_template = templates_dir / index_json['template']

        write_to_file(
            index_json_file.parent / 'index.html',
            index_json,
            page_template
        )

    shutil.copytree(build_dir, public_dir, dirs_exist_ok=True)
