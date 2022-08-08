from email.encoders import encode_noop
import logging
import requests
from jinja2 import Environment
from jinja2 import FileSystemLoader
from pathlib import Path
import re
import os, shutil


OUT_DIR = Path('input')
if os.path.isdir(OUT_DIR):
    shutil.rmtree(OUT_DIR)
else:
    os.mkdir(OUT_DIR)
OUT_DIR.mkdir(exist_ok=True)

links = []
doc_title = ''
doc_ids =['gosuref', 'appguide']
doc_id = 'appguide'

def convert_files(doc_id):
    path = f'http://localhost:1337/api/simple-doc-configs?docId={doc_id}'
    response = requests.get(path)
    response_json = response.json()
    global doc_title
    doc_title = response_json[0]['title']
    simple_doc = response_json[0]['topics']
    for i, item in enumerate(simple_doc):
        content = item['content']
        title = re.sub('[^A-Za-z0-9]+', '-', item['title']).lower()
        file_path = f'{title}.md'
        with open(OUT_DIR / file_path, 'w') as f:
            f.write(content)
        links.append(file_path)

def write_to_file():
    jinja2_environment = Environment(
        loader=FileSystemLoader('apps/strapi_converter/strapi_converter/template'),
        trim_blocks=True,
        lstrip_blocks=True,
        keep_trailing_newline=False,
        optimized=True,
        autoescape=False,
        auto_reload=True
    )
    jinja2_template = jinja2_environment.get_template('ditamap.j2')
    content = jinja2_template.render(
        links=links,
        doc_title=doc_title
    )

    new_file = (OUT_DIR / 'main.ditamap').open('w', encoding='utf-8')
    new_file.write(content)


def main():
    convert_files(doc_id)
    write_to_file()


if __name__ == '__main__':
    main()
