from pathlib import Path
from typing import Dict
from jinja2 import Environment
from jinja2 import FileSystemLoader


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
