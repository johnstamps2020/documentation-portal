import json
import os
from pathlib import Path

current_dir = Path.absolute(Path(__file__)).parent
print(current_dir)
result_path = current_dir / 'out' / 'config.json'
config_path = current_dir.parent.parent / '.teamcity' / 'config' / 'server-config.json'
print(config_path)
result_config = {'docs': []}

with open(config_path) as config_file:
    json_data = json.load(config_file)
    for doc in json_data['docs']:
        if os.environ['DEPLOY_ENV'] in doc['environments']:
            result_config['docs'].append(doc)

with open(result_path, 'w') as result_file:
    json.dump(result_config, result_file, indent=2)
