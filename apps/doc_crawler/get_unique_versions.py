import json
from pathlib import Path

current_dir = Path(__file__)
server_config_file = current_dir.parent.parent.parent / '.teamcity' / 'config' / 'server-config.json'

with open(server_config_file) as f:
    file_data = json.load(f)

docs = file_data.get('docs')
versions = [doc['metadata']['version'] for doc in docs]
all_versions = []
for vers in versions:
    for ver in vers:
        all_versions.append(ver)
unique_versions = set(all_versions)

with open('unique_versions.json', 'w') as nf:
    json.dump({
        "name": "version",
        "values": list(sorted(unique_versions))
    }, nf)
