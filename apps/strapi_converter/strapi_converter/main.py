import os
import re
import shutil
from pathlib import Path

import requests
from jinja2 import Environment, FileSystemLoader

IMG_DIR = 'img'
CURRENT_DIR = Path(__file__).parent
OUT_DIR = CURRENT_DIR / 'input'

def get_doc(doc_id):
    if not doc_id:
        raise ValueError('You must provide doc ID')
    path = f'http://localhost:1337/api/simple-doc-configs?docId={doc_id}'
    response = requests.get(path)
    response_json = response.json()
    if not response_json:
        raise ValueError('The doc ID does not exist')
    return response_json


def prepare_folder(path):
    try:
        shutil.rmtree(path)
    except FileNotFoundError:
        pass
    finally:
        path.mkdir(exist_ok=True)


def save_media(url):
    media_name = url[len('/uploads/'):]
    cms_url = f'http://localhost:1337{url}'
    res = requests.get(cms_url, stream=True)
    if res.status_code == 200:
        media_dir = OUT_DIR / IMG_DIR
        prepare_folder(media_dir)
        with open(media_dir / media_name, 'wb') as f:
            shutil.copyfileobj(res.raw, f)


def update_media_url(content):
    reg = re.finditer('!\[.*\]\(((/uploads).*)\)', content)
    if reg:
        for match in reg:
            old_url = match.group(1)
            save_media(old_url)
            new_url = re.sub(match.group(2), IMG_DIR, old_url)
            content = content.replace(old_url, new_url)
    return content


def convert_files(response_json):
    topic_links = []
    simple_doc = response_json[0]['topics']
    for item in simple_doc:
        content = update_media_url(item['content'])
        title = re.sub('[^A-Za-z0-9]+', '-', item['title']).lower()
        file_path = f'{title}.md'
        with open(OUT_DIR / file_path, 'w') as f:
            f.write(content)
        topic_links.append(file_path)
    return topic_links


def get_title(response_json):
    return response_json[0]['title']


def write_to_file(response_json, topic_links):
    jinja2_environment = Environment(
        loader=FileSystemLoader(CURRENT_DIR / 'template'),
        trim_blocks=True,
        lstrip_blocks=True,
        keep_trailing_newline=False,
        optimized=True,
        autoescape=False,
        auto_reload=True
    )
    jinja2_template = jinja2_environment.get_template('ditamap.j2')
    doc_title = get_title(response_json)
    if doc_title and topic_links:
        content = jinja2_template.render(
            links=topic_links,
            doc_title=doc_title
        )
        new_file = (OUT_DIR / 'main.ditamap').open('w', encoding='utf-8')
        new_file.write(content)


def main():
    simple_doc_id = os.getenv('DOC_ID')
    response = get_doc(simple_doc_id)
    prepare_folder(OUT_DIR)
    links = convert_files(response)
    write_to_file(response, links)


if __name__ == '__main__':
    main()
