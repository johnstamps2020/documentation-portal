import json
import logging
import os
from pathlib import Path
from typing import Optional

import requests

CURRENT_DIR = Path(__file__).parent
CONFIG_DIR = CURRENT_DIR / 'config'


def find_non_existing_sources(src_definitions: list[dict]) -> list or None:
    def get_branches(git_repo_name: str, start_at: Optional[int] = None):
        start_number = start_at or 0
        response = requests.get(
            f'{bitbucket_api_root_url}/DOCSOURCES/repos/{git_repo}/branches?start={start_number}',
            headers=bitbucket_api_headers,
        )
        response_json = response.json()
        if response.ok:
            branches = [v['displayId'] for v in response_json.get('values', [])]
            is_last_page = response_json.get('isLastPage', True)
            if not is_last_page:
                branches.extend(
                    get_branches(git_repo_name, start_at=response_json.get('nextPageStart')))
            return branches
        elif 'NoSuchRepositoryException' in response_json.get('errors')[0].get('exceptionName'):
            return None

    bitbucket_access_token = os.environ.get('BITBUCKET_ACCESS_TOKEN')
    bitbucket_api_root_url = 'https://stash.guidewire.com/rest/api/1.0/projects'
    bitbucket_api_headers = {
        'Authorization': f'Bearer {bitbucket_access_token}'
    }
    missing_sources = []
    for src in src_definitions:
        logging.info(f'Checking the {src["id"]} source')
        src_branch = src['branch']
        git_repo = src['gitUrl'].split('/')[-1].replace('.git', '')
        git_branches = get_branches(git_repo)
        if src not in missing_sources:
            if not git_branches or (git_branches and src_branch not in git_branches):
                missing_sources.append(src)

    (CURRENT_DIR / 'missing_sources.json').open('w').write(json.dumps(missing_sources, indent=2))
    logging.info(f'Missing sources: {len(missing_sources)}')


def list_common_gw_ditavals():
    common_gw_ditavals_dir = Path('/Users/mskowron/Documents/GIT-REPOS/common-gw/ditavals')
    return [f.name for f in common_gw_ditavals_dir.glob('*')]


def load_builds():
    builds_config_file = CONFIG_DIR / 'builds' / 'merge-all.json'
    with open(builds_config_file) as bcf:
        bcf_json = json.load(bcf)
    return bcf_json['builds']


def load_sources():
    sources_config_file = CONFIG_DIR / 'sources' / 'merge-all.json'
    with open(sources_config_file) as scf:
        scf_json = json.load(scf)
    return scf_json['sources']


def find_ditavals_for_update(build_definitions: list[dict], src_definitions: list[dict]):
    common_gw_ditavals = list_common_gw_ditavals()
    ditavals_to_update = []
    for build in build_definitions:
        if build_filter := build.get('filter'):
            if 'common-gw' not in build_filter:
                git_src = next(({
                    'gitUrl': src['gitUrl'],
                    'gitBranch': src['branch']
                } for src in src_definitions if src['id'] == build['srcId']), None)
                if matching_entry := next((entry for entry in ditavals_to_update if entry['filter'] == build_filter),
                                          None):
                    matching_git_src = next((src for src in matching_entry['gitSrcs'] if src == git_src), None)
                    if not matching_git_src:
                        matching_entry['gitSrcs'].append(git_src)
                else:
                    ditavals_to_update.append({
                        'filter': build_filter,
                        'inCommonGwSubmodule': build_filter.split('/')[-1] in common_gw_ditavals,
                        'gitSrcs': [git_src]
                    })
    (CURRENT_DIR / 'ditavals_to_update.json').open('w').write(json.dumps(ditavals_to_update, indent=2))
    logging.info(f'Ditavals outside the common-gw submodule: {len(ditavals_to_update)}')


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    builds = load_builds()
    sources = load_sources()
    # find_ditavals_for_update(builds, sources)
    find_non_existing_sources(sources)
