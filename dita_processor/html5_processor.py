import datetime
import os
import shutil
from pathlib import Path

from lxml import etree

current_year = datetime.datetime.now().year

root_dir = Path(os.environ['OUTPUT_DIR'])
out_dir = Path(__file__).parent / "out"

html_parser = etree.HTMLParser()

with open("assets/header.html") as header_file:
    header_element = etree.fromstring(header_file.read())

with open("assets/head.html") as head_file:
    head_tags = head_file.readlines()

with open("assets/footer.html") as footer_file:
    footer_fragment = etree.fromstring(footer_file.read())

if out_dir.exists():
    shutil.rmtree(out_dir)
shutil.copytree(root_dir, out_dir)

for file in out_dir.glob("**/*.html"):
    file_tree = etree.parse(str(file), parser=html_parser)
    body_element = file_tree.find("body")
    body_element.insert(0, header_element)

    head_element = file_tree.find("head")
    for head_tag in head_tags:
        head_element.insert(-1, etree.fromstring(head_tag))

    with open(file, 'w') as target_file:
        # file_tree.write(target_file, method="html", pretty_print=True, encoding="utf-8")
        file_tree_string = etree.tostring(file_tree, method="html", pretty_print=True).decode('utf-8')
        target_file.write(file_tree_string)
