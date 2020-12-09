import json
import os
import shutil
from pathlib import Path
from typing import Dict, List
import logging


def get_docs_for_env(config_file: Path, env_name: str) -> Dict:
    with open(config_file) as config_file:
        json_data = json.load(config_file)
        json_data.pop('$schema')
        json_data['docs'] = [doc for doc in json_data['docs'] if env_name in doc['environments']]
    return json_data


def get_releases_from_docs(json_data: Dict):
    release_lists = [doc.get('metadata').get('release') for doc in json_data['docs']
                     if doc.get('metadata').get('release') and doc.get('displayOnLandingPages') is not False]

    releases = []
    for single_release_list in release_lists:
        for release in single_release_list:
            releases.append(release)
    unique_releases = sorted(set(releases))
    return unique_releases


def get_paths_index(dir_to_index: Path, allowed_items: List = None):
    paths_in_dir = [path for path in dir_to_index.iterdir()]
    if allowed_items:
        paths_in_dir = [path for path in dir_to_index.iterdir() if any(
            allowed_item in path.stem for allowed_item in allowed_items)]
    return {
        'paths': sorted([path.name for path in paths_in_dir])
    }


def save_json_file(save_path: Path, config_content: Dict):
    with open(save_path, 'w') as result_file:
        json.dump(config_content, result_file, indent=2)


def main():
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    formatter = logging.Formatter('%(levelname)s - %(message)s')
    ch.setFormatter(formatter)
    logger.addHandler(ch)

    config_path = Path(os.environ['CONFIG_FILE'])
    deploy_env = os.environ['DEPLOY_ENV']

    out_dir = config_path.parent / 'out'
    if out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(exist_ok=True, parents=True)

    docs_for_env = get_docs_for_env(config_path, deploy_env)
    config_file_out_path = out_dir / 'config.json'
    save_json_file(config_file_out_path, docs_for_env)
    logger.info(f'Server config file saved to {config_file_out_path}')

    releases = get_releases_from_docs(docs_for_env)
    cloud_taxonomies_path = config_path.parent / 'taxonomy' / 'cloud'

    cloud_taxonomies_out_path = out_dir / 'taxonomy' / 'cloud'
    if cloud_taxonomies_out_path.exists():
        shutil.rmtree(cloud_taxonomies_out_path)
    cloud_taxonomies_out_path.mkdir(exist_ok=True, parents=True)
    cloud_taxonomy_files_paths = get_paths_index(cloud_taxonomies_path, releases)
    cloud_taxonomy_index_out_path = cloud_taxonomies_out_path / 'index.json'
    save_json_file(cloud_taxonomy_index_out_path, cloud_taxonomy_files_paths)
    logger.info(f'Index for cloud taxonomy files saved to {cloud_taxonomy_index_out_path}')
    for taxonomy_file_path in cloud_taxonomy_files_paths['paths']:
        full_taxonomy_file_path = cloud_taxonomies_path / taxonomy_file_path
        shutil.copy2(full_taxonomy_file_path, cloud_taxonomies_out_path)
        logger.info(f'{taxonomy_file_path} copied to {cloud_taxonomies_out_path}')

    self_managed_taxonomy_path = config_path.parent / 'taxonomy' / 'self-managed.json'
    self_managed_taxonomy_out_path = out_dir / 'taxonomy'
    shutil.copy2(self_managed_taxonomy_path, self_managed_taxonomy_out_path)
    logger.info(f'{self_managed_taxonomy_path.name} copied to {self_managed_taxonomy_out_path}')
    logger.info('DONE!')


if __name__ == '__main__':
    main()
