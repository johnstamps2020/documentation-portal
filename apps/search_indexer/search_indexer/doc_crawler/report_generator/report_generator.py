import shutil
from pathlib import Path

from jinja2 import FileSystemLoader, Environment

TEMPLATE_FILE = Path(__file__).parent / 'broken-links.html'


def group_broken_links_by_origin(links: list):
    grouped_links = []
    for link in links:
        keys = link.keys()
    unique_origin_urls = {link.get('origin_url') for link in links}
    for unique_url in unique_origin_urls:
        grouped_links.append(
            {
                'origin_url': unique_url,
                'urls': []
            }
        )

    for link in links:
        for grouped_link in grouped_links:
            if link.get('origin_url') == grouped_link.get('origin_url'):
                grouped_link['urls'].append(link.get('url'))

    sorted_grouped_links = sorted(
        grouped_links, key=lambda x: x['origin_url'], reverse=False)
    for link in sorted_grouped_links:
        link['urls'] = sorted(link['urls'])

    return sorted_grouped_links


def render_str_from_template(template_file: Path() = TEMPLATE_FILE, **kwargs) -> str:
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
