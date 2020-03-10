import json
import shutil
from pathlib import Path

from jinja2 import FileSystemLoader, Environment


def load_json_file(file_path: Path()):
    with open(file_path, 'r') as config_file:
        return json.load(config_file)


def render_str_from_template(template_file: Path(), **kwargs) -> str:
    env = Environment(loader=FileSystemLoader(str(template_file.parent)))
    t = env.get_template(template_file.name)
    return t.render(**kwargs)


def write_content_to_file(page_content: str, output_file_path: Path()):
    with open(output_file_path, "w") as new_page:
        new_page.write(page_content)


def prepare_out_dir(output_dir: Path()):
    if output_dir.exists():
        shutil.rmtree(output_dir)
    output_dir.mkdir(parents=True)


def copy_resources(src_dir: Path(), target_dir: Path()):
    shutil.copytree(src_dir, target_dir)
