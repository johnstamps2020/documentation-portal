import shutil
from pathlib import Path, PurePosixPath
from typing import Callable, Dict, List

from flail_ssg.helpers import configure_logger
from flail_ssg.helpers import load_json_file
from flail_ssg.helpers import write_json_object_to_file

_log_file = Path.cwd() / 'config_generator.log'
_config_generator_logger = configure_logger(
    'config_generator_logger', 'info', _log_file)


def get_doc_urls(page_items: List, doc_urls: List):
    for item in page_items:
        item_doc_url = item.get('doc_url')
        if item_doc_url:
            doc_urls.append(item_doc_url)
        if item.get('items'):
            get_doc_urls(item['items'], doc_urls)
    return doc_urls


def create_breadcrumbs_mapping(pages_build_dir: Path, config_build_dir: Path):
    breadcrumbs = []
    for index_json_file in pages_build_dir.rglob('**/*.json'):
        page_config = load_json_file(index_json_file)
        items = page_config.json_object.get('items')
        if items:
            page_doc_urls = get_doc_urls(items, [])
            if page_doc_urls:
                for doc_url in page_doc_urls:
                    matching_breadcrumb = next(
                        (item for item in breadcrumbs if item.get('docUrl') == doc_url), None)
                    breadcrumb_path = f'/{str(PurePosixPath(index_json_file.relative_to(pages_build_dir).parent))}'

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


def filter_docs_by_property(docs: List, property_name: str, doc: Dict):
    filtered_docs = []
    filter_values = doc.get('metadata').get(property_name)
    doc_id = doc.get('id')
    for doc in docs:
        if doc.get('id') != doc_id:
            if doc.get('displayOnLandingPages'):
                if any(value for value in filter_values if value in doc.get('metadata').get(property_name)):
                    filtered_docs.append(doc)

    return filtered_docs


def create_version_selector_mapping(pages_build_dir: Path, config_build_dir: Path, docs: List):
    version_selectors = []
    for doc in docs:
        doc_products = doc.get('metadata').get('product')
        doc_platforms = doc.get('metadata').get('platform')
        doc_versions = doc.get('metadata').get('version')
        for product in doc_products:
            for platform in doc_platforms:
                for version in doc_versions:
                    matching_version_selector_object = next((
                        item for item in version_selectors if
                        item.get('product') == product and item.get('platform') == platform and item.get(
                            'version') == version), None
                    )
                    if not matching_version_selector_object:
                        version_selectors.append(
                            {
                                'product': product,
                                'platform': platform,
                                'version': version,
                                'otherVersions': []
                            }
                        )

    doc_urls_with_root_pages = create_breadcrumbs_mapping(pages_build_dir, config_build_dir)
    for doc in docs:
        doc_products = doc.get('metadata').get('product')
        doc_platforms = doc.get('metadata').get('platform')
        doc_versions = doc.get('metadata').get('version')
        for product in doc_products:
            for platform in doc_platforms:
                for version in doc_versions:
                    selector_objects_to_update = [
                        item for item in version_selectors if
                        item.get('product') == product and item.get('platform') == platform and item.get(
                            'version') != version]
                    for obj in selector_objects_to_update:
                        matching_other_version = next((
                            item for item in obj.get('otherVersions') if item.get('label') == version
                        ), None)
                        if matching_other_version:
                            matching_item = next(
                                (item for item in doc_urls_with_root_pages if
                                 item['docUrl'] == matching_other_version['path']), None
                            )

                            if matching_item:
                                root_pages = matching_item['rootPages']
                                fallback_paths = matching_other_version.get('fallbackPaths')
                                if not fallback_paths:
                                    matching_other_version['fallbackPaths'] = []
                                matching_other_version['fallbackPaths'] += [item['path'] for item in root_pages]
                        else:
                            obj['otherVersions'].append(
                                {
                                    "label": version,
                                    "path": f'/{doc.get("url")}',
                                }

                            )

    for selector in version_selectors:
        for other_ver in selector['otherVersions']:
            if other_ver.get('fallbackPaths'):
                unique_fallback_paths = set(other_ver['fallbackPaths'])
                other_ver['fallbackPaths'] = list(unique_fallback_paths)

    write_json_object_to_file(
        version_selectors, config_build_dir / 'versionSelectors.json')


def run_config_generator(send_bouncer_home: bool, pages_build_dir: Path, config_build_dir: Path,
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
    run_process(create_version_selector_mapping, pages_build_dir, config_build_dir, docs)

    _config_generator_logger.info(
        'PROCESS ENDED: Generate frontend configuration')
