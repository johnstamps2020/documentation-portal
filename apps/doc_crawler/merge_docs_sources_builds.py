import json
from pathlib import Path

current_dir = Path(__file__)

with open(current_dir.parent.parent.parent / '.teamcity' / 'config' / 'server-config.json') as server_config_file:
    server_config_file_data = json.load(server_config_file)
with open(current_dir.parent.parent.parent / '.teamcity' / 'config' / 'sources.json') as sources_file:
    sources_file_data = json.load(sources_file)
with open(current_dir.parent.parent.parent / '.teamcity' / 'config' / 'builds.json') as builds_file:
    builds_file_data = json.load(builds_file)

docs = server_config_file_data.get('docs')
sources = sources_file_data.get('sources')
builds = builds_file_data.get('builds')

for doc in docs:
    doc_id = doc['id']
    try:
        doc_build = next(build for build in builds if build['docId'] == doc_id)
    except StopIteration:
        doc_build = None
    try:
        doc_source = next(src for src in sources if doc_build and src['id'] == doc_build['srcId'])
    except StopIteration:
        doc_source = None

    if doc_source:
        doc['sourceUrl'] = doc_source['gitUrl']
        doc['gitBranch'] = doc_source.get('branch', 'master')
        xdocs_path_ids = doc_source.get('xdocsPathIds', None)
        if xdocs_path_ids:
            doc['xDocsPathIds'] = xdocs_path_ids

    if doc_build:
        build_type = doc_build['buildType']
        doc['buildType'] = build_type
        if build_type == 'dita':
            doc['ditaFilter'] = doc_build['filter']
            doc['ditaMap'] = doc_build['root']
            doc['ditaIndexRedirect'] = doc_build.get('indexRedirect', False)
        working_dir = doc_build.get('workingDir', None)
        if build_type == 'yarn' and working_dir:
            doc['buildWorkingDir'] = working_dir
        resources = doc_build.get('resources', None)
        if resources:
            modified_resources = []
            for resource in resources:
                resource_source = next(src for src in sources if src['id'] == resource['srcId'])
                resource.pop('srcId')
                resource['sourceUrl'] = resource_source['gitUrl']
                resource['gitBranch'] = resource_source.get('branch', 'master')
                modified_resources.append(resource)
            doc['buildResources'] = modified_resources

with open(current_dir.parent / 'new-server-config.json', 'w') as new_server_config_file:
    json.dump(server_config_file_data, new_server_config_file)
