import copy
import shutil
from pathlib import Path, PurePosixPath
from typing import Callable

from packaging import version as packaging_version

from flail_ssg.helpers import configure_logger
from flail_ssg.helpers import load_json_file
from flail_ssg.helpers import write_json_object_to_file

_log_file = Path.cwd() / 'config_generator.log'
_config_generator_logger = configure_logger(
    'config_generator_logger', 'info', _log_file)


def get_doc_urls(page_items: list, doc_urls: list) -> list:
    for item in page_items:
        item_doc_url = item.get('doc_url')
        if item_doc_url:
            doc_urls.append(item_doc_url)
        if item.get('items'):
            get_doc_urls(item['items'], doc_urls)
    return doc_urls


def create_breadcrumbs_mapping(pages_build_dir: Path, config_build_dir: Path) -> list:
    breadcrumbs = []
    for index_json_file in pages_build_dir.rglob('*.json'):
        page_config = load_json_file(index_json_file)
        items = page_config.json_object.get('items')
        if items:
            page_doc_urls = get_doc_urls(items, [])
            if page_doc_urls:
                for doc_url in page_doc_urls:
                    matching_breadcrumb = next(
                        (item for item in breadcrumbs if item.get('docUrl') == doc_url), None)
                    breadcrumb_path = f'/{PurePosixPath(index_json_file.relative_to(pages_build_dir).parent)}'

                    if matching_breadcrumb:
                        matching_breadcrumb['rootPages'].append(
                            {
                                "label": page_config.json_object['title'],
                                "path": breadcrumb_path
                            }
                        )
                    else:
                        breadcrumbs.append(
                            {
                                "docUrl": doc_url,
                                "rootPages": [
                                    {
                                        "label": page_config.json_object['title'],
                                        "path": breadcrumb_path
                                    }
                                ]
                            }
                        )

    write_json_object_to_file(
        breadcrumbs, config_build_dir / 'breadcrumbs.json')

    return breadcrumbs


def get_visible_docs_for_env(docs: list, env: str):
    return [
        doc
        for doc in docs
        if doc.get('displayOnLandingPages') and any(value for value in doc.get('environments') if value == env)
    ]


def create_version_selector_mapping(config_build_dir: Path, docs: list, deploy_env: str):
    def get_data_for_comparison(doc_object: dict) -> dict:
        item_metadata = doc_object['metadata']
        return {
            'products': sorted([product.casefold() for product in item_metadata['product']]),
            'platforms': sorted([platform.casefold() for platform in item_metadata['platform']]),
            'versions': sorted([version.casefold() for version in item_metadata['version']]),
            'title': doc_object['title'].casefold()
        }

    def is_other_version(first_doc_object: dict, second_doc_object: dict) -> bool:
        first_doc_data_for_comparison = get_data_for_comparison(first_doc_object)
        second_doc_data_for_comparison = get_data_for_comparison(second_doc_object)

        products_match = any(
            pr in first_doc_data_for_comparison['products'] for pr in second_doc_data_for_comparison['products'])
        platforms_match = any(
            pl in first_doc_data_for_comparison['platforms'] for pl in second_doc_data_for_comparison['platforms'])
        titles_match = first_doc_data_for_comparison['title'] == second_doc_data_for_comparison['title']
        versions_are_different = any(
            v not in first_doc_data_for_comparison['versions'] for v in second_doc_data_for_comparison[
                'versions'])

        return products_match and platforms_match and titles_match and versions_are_different

    def sort_and_add_labels(version_objects: list[dict]):
        use_release = all(v.get('releases') and len(v['releases']) == 1 for v in version_objects)
        updated_version_objects = copy.deepcopy(version_objects)
        if use_release:
            for version_object in updated_version_objects:
                version_object['label'] = f'{version_object["releases"][0]} ({version_object["versions"][0]})'
            return sorted(updated_version_objects, key=lambda x: x['releases'][0], reverse=True)
        else:
            for version_object in updated_version_objects:
                version_object['label'] = ','.join(version_object['versions'])
            return sorted(updated_version_objects, key=lambda x: packaging_version.parse(','.join(x['versions'])),
                          reverse=True)

    def create_version_selector_objects(main_doc_object: dict, matching_doc_objects: list[dict]) -> list[dict]:
        version_selector_objects = []
        if matching_doc_objects:
            all_versions = []
            for doc_object in matching_doc_objects:
                doc_object_metadata = doc_object['metadata']
                all_versions.append({
                    'versions': doc_object_metadata['version'],
                    'releases': doc_object_metadata.get('release'),
                    'url': doc_object['url'],
                })
            main_doc_object_metadata = main_doc_object['metadata']
            all_versions.append(
                {
                    'versions': main_doc_object_metadata['version'],
                    'releases': main_doc_object_metadata.get('release'),
                    'url': main_doc_object['url'],
                    'currentlySelected': True,
                }
            )
            version_selector_objects.append(
                {
                    'docId': main_doc_object['id'],
                    'allVersions': sort_and_add_labels(all_versions)
                }
            )
        return version_selector_objects

    version_selectors = []
    visible_docs_for_env = get_visible_docs_for_env(docs, deploy_env)
    for doc in visible_docs_for_env:
        matching_docs = []
        for env_doc in visible_docs_for_env:
            if is_other_version(doc, env_doc) and env_doc not in matching_docs:
                matching_docs.append(env_doc)
        doc_version_selectors = create_version_selector_objects(doc, matching_docs)
        version_selectors += doc_version_selectors

    write_json_object_to_file(
        version_selectors, config_build_dir / 'versionSelectors.json')


def run_config_generator(send_bouncer_home: bool, deploy_env: str, pages_build_dir: Path, config_build_dir: Path,
                         docs_config_file: Path):
    def run_process(func: Callable, *args):
        try:
            return func(*args)
        except Exception as e:
            if send_bouncer_home:
                _config_generator_logger.warning(
                    f'**WATCH YOUR BACK: Bouncer is home, errors got inside.**'
                    f'\n{e}')
            else:
                raise e

    docs = load_json_file(docs_config_file).json_object['docs']

    _config_generator_logger.info(
        'PROCESS STARTED: Generate frontend configuration')

    if config_build_dir.exists():
        shutil.rmtree(config_build_dir)
    config_build_dir.mkdir(parents=True)

    run_process(create_breadcrumbs_mapping, pages_build_dir, config_build_dir)
    run_process(create_version_selector_mapping, config_build_dir, docs, deploy_env)

    _config_generator_logger.info(
        'PROCESS ENDED: Generate frontend configuration')
