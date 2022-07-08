import logging
import requests
from jinja2 import Environment
from jinja2 import FileSystemLoader
from pathlib import Path

OUT_DIR = Path('input')
OUT_DIR.mkdir(exist_ok=True)

links = []


def convert_files():
    response = requests.get('http://localhost:1337/api/simple-docs/1?populate=topic',
                            headers={'Content-Type': 'application/json'})
    response_json = response.json()
    topic = response_json['data']['attributes']['topic']
    for n, item in enumerate(topic):
        content = item['content']
        file_path = f'{n}.md'
        with open(OUT_DIR / file_path, 'w') as f:
            f.write(content)
        links.append(file_path)
    logging.info('DONE')


def write_to_file():
    jinja2_environment = Environment(
        loader=FileSystemLoader('template'),
        trim_blocks=True,
        lstrip_blocks=True,
        keep_trailing_newline=False,
        optimized=True,
        autoescape=False,
        auto_reload=True
    )
    jinja2_template = jinja2_environment.get_template('ditamap.j2')
    content = jinja2_template.render(
        links=links
    )

    new_file = (OUT_DIR / 'main.ditamap').open('w', encoding='utf-8')
    new_file.write(content)


def main():
    convert_files()
    write_to_file()


if __name__ == '__main__':
    main()
