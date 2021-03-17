import json
import logging
import os
import shutil
from pathlib import Path
from typing import Dict


def get_docs_for_env(config_file: Path, env_name: str) -> Dict:
    with open(config_file) as config_file:
        json_data = json.load(config_file)
        json_data.pop('$schema')
        json_data['docs'] = [doc for doc in json_data['docs'] if env_name in doc['environments']]
    return json_data


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

    logger.info(f'Preparing server config and taxonomy files for "{deploy_env.upper()}" environment')

    out_dir = config_path.parent / 'out'
    if out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(exist_ok=True, parents=True)

    docs_for_env = get_docs_for_env(config_path, deploy_env)
    config_file_out_path = out_dir / 'config.json'
    save_json_file(config_file_out_path, docs_for_env)
    logger.info(f'Server config file saved to {config_file_out_path}')
    logger.info('DONE!')


if __name__ == '__main__':
    main()
