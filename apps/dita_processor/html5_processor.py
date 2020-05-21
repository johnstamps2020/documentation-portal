import os

import datetime
import shutil
from lxml import etree
from pathlib import Path
from string import Template

current_year = datetime.datetime.now().year

root_dir = Path(os.environ['DITA_OUTPUT_DIR'])
out_dir = Path(os.environ['OUTPUT_DIR'])
current_dir = Path(__file__).parent
assets_dir = current_dir / 'assets'

html_parser = etree.HTMLParser()

with open(assets_dir / 'header.html') as header_file:
    header_element = etree.fromstring(header_file.read())

with open(assets_dir / 'head.txt') as head_file:
    head_tags = head_file.readlines()

with open(assets_dir / 'footer.html') as footer_file:
    footer_element_template = Template(footer_file.read())
    footer_element = etree.fromstring(footer_element_template.substitute(current_year=current_year))

if out_dir.exists():
    shutil.rmtree(out_dir)
shutil.copytree(root_dir, out_dir)

for file in out_dir.glob("**/*.html"):
    file_tree = etree.parse(str(file), parser=html_parser)
    body_element = file_tree.find("body")
    body_element.insert(0, header_element)
    body_element.insert(len(body_element.getchildren()), footer_element)

    head_element = file_tree.find("head")
    for head_tag in head_tags:
        head_element.insert(len(head_element.getchildren()), etree.fromstring(head_tag))

    with open(file, 'w') as target_file:
        file_tree_string = etree.tostring(file_tree, method="html", pretty_print=True).decode('utf-8')
        target_file.write(file_tree_string)
