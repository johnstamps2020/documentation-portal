import json
import shutil
from pathlib import Path

from jinja2 import FileSystemLoader, Environment


def group_broken_links_by_origin(links: list):
    grouped_links = []
    for link in links:
        keys = link.keys()
    unique_origin_urls = set((link.get('origin_url') for link in links))
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


def load_json_lines_file(file_path: Path()):
    with open(file_path, 'r') as file_data:
        return [json.loads(line) for line in file_data]


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


def main():
    current_dir = Path(__file__).parent
    broken_links_template_file = Path('broken-links.html')
    out_dir = current_dir.parent / 'out'
    target_dir = out_dir / 'html'
    broken_links_report = target_dir / broken_links_template_file
    broken_links = load_json_lines_file(out_dir / 'broken-links.json')
    broken_links_page_content = render_str_from_template(broken_links_template_file,
                                                         broken_links=group_broken_links_by_origin(broken_links),
                                                         page_title='Broken links report')
    prepare_out_dir(target_dir)
    write_content_to_file(broken_links_page_content, broken_links_report)


if __name__ == '__main__':
    main()
