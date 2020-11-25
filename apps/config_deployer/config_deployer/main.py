import json
import os
from pathlib import Path
from typing import Dict


def get_docs_for_env(config_file: Path, env_name: str) -> Dict:
    with open(config_file) as config_file:
        json_data = json.load(config_file)
        json_data.pop('$schema')
        json_data['docs'] = [doc for doc in json_data['docs'] if env_name in doc['environments']]
    return json_data


def get_paths_index(dir_to_index: Path):
    paths_in_dir = [path.name for path in dir_to_index.iterdir()]
    return {
        'paths': paths_in_dir
    }


def save_json_file(save_path: Path, config_content: Dict):
    save_path.parent.mkdir(exist_ok=True, parents=True)
    with open(save_path, 'w') as result_file:
        json.dump(config_content, result_file, indent=2)


def main():
    config_path = Path(os.environ['CONFIG_FILE'])
    deploy_env = os.environ['DEPLOY_ENV']
    config_out_path = config_path.parent / 'out' / 'config.json'
    save_json_file(config_out_path, get_docs_for_env(config_path, deploy_env))
    cloud_taxonomies_path = config_path.parent / 'taxonomy' / 'cloud'
    cloud_taxonomies_index_out_path = config_path.parent / 'out' / 'taxonomy' / 'cloud' / 'index.json'
    save_json_file(cloud_taxonomies_index_out_path, get_paths_index(cloud_taxonomies_path))


if __name__ == '__main__':
    main()
