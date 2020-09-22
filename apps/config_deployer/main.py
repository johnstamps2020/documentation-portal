import json
import os
from pathlib import Path
from typing import Dict


def get_docs_for_env(config_file: Path, env_name: str) -> Dict:
    result_config = {'docs': []}
    with open(config_file) as config_file:
        json_data = json.load(config_file)
        for doc in json_data['docs']:
            if env_name in doc['environments']:
                result_config['docs'].append(doc)
    return result_config


def save_config_for_env(save_path: Path, config_content: Dict):
    save_path.parent.mkdir(exist_ok=True)
    with open(save_path, 'w') as result_file:
        json.dump(config_content, result_file, indent=2)


def main():
    current_dir = Path.absolute(Path(__file__)).parent
    config_path = current_dir.parent.parent / '.teamcity' / 'config' / 'server-config.json'
    deploy_env = os.environ['DEPLOY_ENV']
    result_path = current_dir / 'out' / 'config.json'
    save_config_for_env(result_path, get_docs_for_env(config_path, deploy_env))


if __name__ == '__main__':
    main()
