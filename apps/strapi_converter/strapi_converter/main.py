import logging
import os
from pydoc import doc
import re
import shutil
from email.encoders import encode_noop
from pathlib import Path
from tabnanny import check

import requests
from jinja2 import Environment, FileSystemLoader

links = []
doc_id = os.getenv("DOC_ID")
dir_name = 'img'
current_dir = Path(__file__).parent
OUT_DIR = current_dir / 'input'

def get_response(doc_id):
    path = f'http://localhost:1337/api/simple-doc-configs?docId={doc_id}'
    response = requests.get(path)
    response_json = response.json()
    if (response_json):
        return response_json
    else: 
        return 0

def prepare_folder(path):
    try:
        shutil.rmtree(path)
    except(FileNotFoundError):
        pass
    finally:
        path.mkdir(exist_ok=True)

def save_media(url):
    media_name = url[len('uploads/'):]
    cms_url = f'http://localhost:1337{url}'
    res = requests.get(cms_url, stream = True)
    if res.status_code == 200:
        media_dir = current_dir / dir_name
        prepare_folder(media_dir)
        with open(f'{dir_name}/{media_name}','wb') as f:
            shutil.copyfileobj(res.raw, f)

def update_media_url(content):
    reg = re.finditer('!\[.*\]\((/(uploads).*)\)', content)
    if (reg): 
        for match in reg:
            old_url = match.group(1)
            save_media(old_url)
            new_url = re.sub(match.group(2), dir_name, old_url)
            content = content.replace(old_url, new_url)
    return content

def convert_files(doc_id):
    if (doc_id!=None):
        prepare_folder(OUT_DIR)
        response_json =  get_response(doc_id)
        if (response_json):
            simple_doc = response_json[0]['topics']
            for item in simple_doc:
                content = update_media_url(item['content'])
                title = re.sub('[^A-Za-z0-9]+', '-', item['title']).lower()
                file_path = f'{title}.md'
                with open(OUT_DIR / file_path, 'w') as f:
                    f.write(content)
                links.append(file_path)
        else:
            print('This doc ID does not exist')
    else:
        print('You must provide doc ID')

def get_title(doc_id):
    response_json = get_response(doc_id)
    if (response_json):
        title = response_json[0]['title']
        return title
    else:
        return ''

def write_to_file():
    jinja2_environment = Environment(
        loader=FileSystemLoader(current_dir / 'template'),
        trim_blocks=True,
        lstrip_blocks=True,
        keep_trailing_newline=False,
        optimized=True,
        autoescape=False,
        auto_reload=True
    )
    jinja2_template = jinja2_environment.get_template('ditamap.j2')
    if(doc_id!=None):
        doc_title = get_title(doc_id)
        if (doc_title and links):
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
