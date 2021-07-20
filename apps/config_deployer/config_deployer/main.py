import json
import logging
import os
import shutil
from pathlib import Path
from typing import Dict
import argparse


def load_json_file(json_file: Path):
    with open(json_file) as json_file:
        return json.load(json_file)


def save_json_file(save_path: Path, config_content: Dict):
    with open(save_path, 'w') as result_file:
        json.dump(config_content, result_file, indent=2)


def get_elements_from_all_config_files(config_files_dir: Path, root_node_name: str):
    all_elements = []
    for config_file in config_files_dir.rglob('*.json'):
        all_elements += load_json_file(config_file).get(root_node_name)
    return {
        root_node_name: sorted(all_elements, key=lambda x: x['id'])
    }


def get_docs_for_env(config_file: Path, env_name: str) -> Dict:
    json_data = load_json_file(config_file)
    json_data.pop('$schema')
    json_data['docs'] = [doc for doc in json_data['docs'] if env_name in doc['environments']]
    return json_data


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--merge', help='Merge individual config files into one file', action='store_true')
    parser.add_argument('--deploy', help='Filter a config file by the deployment environment', action='store_true')
    args = parser.parse_args()

    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    formatter = logging.Formatter('%(levelname)s - %(message)s')
    ch.setFormatter(formatter)
    logger.addHandler(ch)

    if args.merge:
        src_config_files_dir = Path(os.environ['SRC_CONFIG_FILES_DIR'])
        src_docs_config_dir = src_config_files_dir / 'docs'
        src_sources_config_dir = src_config_files_dir / 'sources'
        src_builds_config_dir = src_config_files_dir / 'builds'

        merged_config_files_dir = Path(os.environ['MERGED_CONFIG_FILES_DIR'])
        merged_docs_config_path = merged_config_files_dir / 'server-config.json'
        merged_sources_config_path = merged_config_files_dir / 'sources.json'
        merged_builds_config_path = merged_config_files_dir / 'builds.json'
    elif args.deploy:
        config_path = Path(os.environ['CONFIG_FILE'])
        deploy_env = os.environ['DEPLOY_ENV']

        logger.info(f'Preparing server config for "{deploy_env.upper()}" environment')

        out_dir = config_path.parent / 'out'
        if out_dir.exists():
            shutil.rmtree(out_dir)
        out_dir.mkdir(exist_ok=True, parents=True)

        docs_for_env = get_docs_for_env(config_path, deploy_env)
        config_file_out_path = out_dir / 'config.json'
        save_json_file(config_file_out_path, docs_for_env)
        logger.info(f'Server config file saved to {config_file_out_path}')
        logger.info('DONE!')
    else:
        logger.error('No option provided. Use -h for more information on available options.')


if __name__ == '__main__':
    main()
