import json
import os
import shutil
from pathlib import Path

from natsort import natsorted, ns


def get_paths(path: Path) -> []:
    return [f for f in path.iterdir() if f.is_dir() and not f.name.startswith('.')]


def get_sibling_paths(path: Path) -> []:
    return [
        f
        for f in path.parent.iterdir()
        if f.is_dir() and f != path and not f.name.startswith('.')
    ]


def write_top_index(dirs: [], docs_output_path: Path):
    index_json = {
        "$schema": "/frontend/page-schema.json",
        "title": "Upgrade Diff Reports",
        "template": "page",
        "class": "twoCards upgradediffs upgradediffs-products",
        "items": []
    }

    for d in dirs:
        index_json["items"].append(
            {
                "label": d.name,
                "class": "productFamily cardShadow",
                "page": d.name
            }
        )

    with open(docs_output_path / 'index.json', 'w', encoding='utf-8') as outfile:
        json.dump(index_json, outfile, indent=2, ensure_ascii=False)


def write_index(src_path, output_path, selector_label, generate_links=False, env='prod'):
    index_json = {
        "$schema": "/frontend/page-schema.json",
        "title": src_path.name,
        "template": "page",
        "class": 'threeCards upgradediffs',
        "items": [],
    }

    sibling_paths = get_sibling_paths(src_path)
    if sibling_paths:
        sibling_paths = natsorted(
            sibling_paths, alg=ns.PATH, reverse=True)
        index_json.update(
            {
                "selector":
                    {
                        "label": selector_label,
                        "selectedItem": src_path.name,
                        "items": []
                    }
            }
        )
        for path in sibling_paths:
            index_json["selector"]["items"].append(
                {
                    "label": path.name,
                    "page": "../" + path.name
                }
            )

    child_paths = get_paths(src_path)
    child_paths = natsorted(
        child_paths, alg=ns.PATH, reverse=True)
    for child_path in child_paths:
        if env in ['prod', 'staging'] and '-rc' in child_path.name:
            continue
        if not generate_links:
            index_json["items"].append(
                {
                    "label": child_path.name,
                    "class": "productFamily cardShadow",
                    "page": child_path.name
                }
            )
        else:
            link = child_path.relative_to(
                Path(os.environ['UPGRADEDIFFS_DOCS_SRC']))
            index_json["items"].append(
                {
                    "label": child_path.name,
                    "class": "productFamily cardShadow",
                    "link": '/upgradediffs/' + str(link).replace('\\', '/').replace(' ', '%20')
                }
            )

    Path.mkdir(output_path)
    with open(output_path / 'index.json', 'w', encoding='utf-8') as outfile:
        json.dump(index_json, outfile, indent=2, ensure_ascii=False)


def prepare_output_dir(output_dir: Path):
    shutil.rmtree(output_dir, ignore_errors=True)
    output_dir.mkdir(parents=True)


# TODO: add readme.md
# TODO: add logging
# TODO: add strict mode


def main():
    docs_root_path = Path(os.environ.get('UPGRADEDIFFS_DOCS_SRC'))
    docs_output_path = Path(os.environ.get('UPGRADEDIFFS_DOCS_OUT'))
    deploy_env = os.environ.get('DEPLOY_ENV')
    prepare_output_dir(docs_output_path)

    product_dirs = get_paths(docs_root_path)
    product_dirs.sort()
    write_top_index(product_dirs, docs_output_path)

    for product_dir in product_dirs:
        write_index(product_dir, docs_output_path /
                    product_dir.name, "Select product", False, deploy_env)
        version_from_dirs = get_paths(product_dir)
        version_from_dirs.sort()
        for version_from_dir in version_from_dirs:
            write_index(
                version_from_dir, docs_output_path / product_dir.name / version_from_dir.name,
                "Select version to upgrade from", True, deploy_env)


if __name__ == '__main__':
    main()
