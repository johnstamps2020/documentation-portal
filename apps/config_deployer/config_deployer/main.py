import json
import logging
import os
import shutil
from pathlib import Path
from typing import Dict


def load_json_file(json_file: Path):
    with open(json_file) as json_file:
        return json.load(json_file)


def save_json_file(save_path: Path, config_content: Dict):
    with open(save_path, 'w') as result_file:
        json.dump(config_content, result_file, indent=2)


def get_docs_for_env(config_files_dir: Path, env_name: str) -> Dict:
    all_docs = []
    for config_file in config_files_dir.rglob('*.json'):
        all_docs += load_json_file(config_file).get('docs')
    docs_filtered_by_env = [doc for doc in all_docs if env_name in doc['environments']]
    return {
        'docs': sorted(docs_filtered_by_env, key=lambda x: x['id'])
    }


def main():
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    formatter = logging.Formatter('%(levelname)s - %(message)s')
    ch.setFormatter(formatter)
    logger.addHandler(ch)

    config_files_dir = Path(os.environ['CONFIG_FILES_DIR'])
    deploy_env = os.environ['DEPLOY_ENV']

    logger.info(f'Preparing server config for "{deploy_env.upper()}" environment')

    out_dir = config_files_dir.parent / 'out'
    if out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(exist_ok=True, parents=True)

    docs_for_env = get_docs_for_env(config_files_dir, deploy_env)
    config_file_out_path = out_dir / 'config.json'
    save_json_file(config_file_out_path, docs_for_env)
    logger.info(f'Server config file saved to {config_file_out_path}')
    logger.info('DONE!')


if __name__ == '__main__':
    main()
