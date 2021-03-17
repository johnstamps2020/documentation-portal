import json
import shutil
from pathlib import Path
from typing import Dict
from jinja2 import Environment
from jinja2 import FileSystemLoader

from flail_ssg.helpers import configure_logger

_log_file = Path.cwd() / 'template_writer_logger.log'
_template_writer_logger = configure_logger(
    'template_writer_logger', 'info', _log_file)


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

    new_file = out_file_path.open('w', encoding='utf-8')
    new_file.write(content)


def run_template_writer(send_bouncer_home: bool, templates_dir: Path, build_dir: Path, output_dir: Path):
    _template_writer_logger.info('PROCESS STARTED: Build pages from templates')

    for index_json_file in build_dir.rglob('**/*.json'):
        try:
            index_json = json.load(index_json_file.open(encoding='utf-8'))
            _template_writer_logger.info(
                f'Building "{index_json["title"]}" page from "{index_json["template"]}" template')
            page_template = templates_dir / index_json['template']

            write_to_file(
                index_json_file.parent / 'index.html',
                index_json,
                page_template
            )
        except Exception as e:
            if send_bouncer_home:
                _template_writer_logger.warning(
                    '**WATCH YOUR BACK: Bouncer is home, errors got inside.**')
            else:
                raise e

    _template_writer_logger.info('Removing JSON files')
    for index_json_file in build_dir.rglob('**/*.json'):
        index_json_file.unlink()

    shutil.copytree(build_dir, output_dir, dirs_exist_ok=True)
    _template_writer_logger.info('PROCESS ENDED: Build pages from templates')
