from email.encoders import encode_noop
import logging
import requests
from jinja2 import Environment
from jinja2 import FileSystemLoader
from pathlib import Path
import re

OUT_DIR = Path('input')
OUT_DIR.mkdir(exist_ok=True)

links = []
doc_title = ''
docId = 'appguide'

def convert_files(docId):
    path = f'http://localhost:1337/api/simple-docs?filters[docId][$eq]={docId}&populate=topics'
    response = requests.get(path)
    response_json = response.json()
    global doc_title
    doc_title = response_json['data'][0]['attributes']['title']
    simple_doc = response_json['data'][0]['attributes']['topics']['data']
    for i, item in enumerate(simple_doc):
        content = item['attributes']['content']
        title = re.sub('[^A-Za-z0-9]+', '-', item['attributes']['title']).lower()
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
    convert_files(docId)
    write_to_file()


if __name__ == '__main__':
    main()
