import copy
import json
import shutil
from jinja2 import Environment
from jinja2 import FileSystemLoader
from pathlib import Path
from typing import Dict, List

# -------------------------
#        :::TO DO:::
# -------------------------
# crawl files starting from the top and following "page" links
# pages can have relative links, IDs can only be a single value
# don't crawl the same page twice, even if more than one link points to it
# if an object has an env which does not match current env, don't add it and 
#   don't crawl down from it
# throw an error when a docs ID does not exist
# throw an error when an ID contains a /
# allow a 'loose' mode where errors become warnings
# something to the home page which will make the browser skip this page and 
#   redirect ot a selected link
# on each page, add a breadcrumb
# on each page, add a dropdown which allows you to switch to a sibling page, 
#   e.g., on the billingCenterForGuidewireCloud allow the user to switch to
#   policyCenterForGuidewireCloud and claimCenterForGuidewireCloud
# add the toggle between cloud/self-managed
# add the links to community
# add the log in/log out button
# implement the search page
# implement the login page

CURRENT_DIR = Path(__file__).parent.resolve()
PAGES_DIR = CURRENT_DIR / 'pages'
TEMPLATES_DIR = CURRENT_DIR / 'templates'
BUILD_DIR = CURRENT_DIR / 'build'
PUBLIC_DIR = CURRENT_DIR.parent / 'public'
CONFIG_FILE = CURRENT_DIR.parent.parent / \
    '.teamcity' / 'config' / 'server-config.json'


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
            matching_doc_object = next(
                (doc for doc in docs if doc['id'] == item['id']), None)
            if matching_doc_object:
                item['id'] = f'/{matching_doc_object["url"]}'
            else:
                print(f'NO MATCHING ID FOR {item["id"]}')
        if item.get('items'):
            item['items'] = convert_id_to_url(item['items'])
    return converted_items


for json_file in BUILD_DIR.rglob('**/*.json'):
    json_data = json.load(json_file.open())
    page_template = TEMPLATES_DIR / json_data['template']
    json_data['items'] = convert_id_to_url(json_data['items'])

    write_to_file(
        json_file.parent / 'index.html',
        json_data,
        page_template
    )

shutil.copytree(BUILD_DIR, PUBLIC_DIR, dirs_exist_ok=True)
