import json
import logging
import os
from pathlib import Path
from typing import Optional

import requests

CURRENT_DIR = Path(__file__).parent
CONFIG_DIR = CURRENT_DIR / 'config'
BITBUCKET_API_ROOT_URL = 'https://stash.guidewire.com/rest/api/1.0/projects'
BITBUCKET_ACCESS_TOKEN = os.environ.get('BITBUCKET_ACCESS_TOKEN')
BITBUCKET_API_HEADERS = {
    'Authorization': f'Bearer {BITBUCKET_ACCESS_TOKEN}'
}


def list_common_gw_ditavals(start_at: Optional[int] = None):
    start_number = start_at or 0
    common_gw_ditavals_url = f'{BITBUCKET_API_ROOT_URL}/DOCSOURCES/repos/common-gw/browse/ditavals?start={start_number}'
    response = requests.get(
        common_gw_ditavals_url,
        headers=BITBUCKET_API_HEADERS,
    )
    response_json = response.json()
    ditaval_files = []
    if response_children := response_json.get('children'):
        ditaval_files = [ditaval_file['path']['toString'] for ditaval_file in response_children.get('values', [])]
        is_last_page = response_children.get('isLastPage', True)
        if not is_last_page:
            ditaval_files.extend(
                list_common_gw_ditavals(start_at=response_json.get('nextPageStart')))
    return ditaval_files


def find_non_existent_sources(src_definitions: list[dict]):
    git_url_root = 'ssh://git@stash.guidewire.com/'

    def git_url_is_valid(git_url: str) -> bool:
        return git_url.startswith(git_url_root)

    def get_request_url(git_url: dict) -> str:
        git_project, git_repo = git_url.replace(git_url_root, '').replace('.git', '').split('/')
        return f'{BITBUCKET_API_ROOT_URL}/{git_project}/repos/{git_repo}/branches'

    def get_branches(request_url: str, start_at: Optional[int] = None) -> list or None:
        start_number = start_at or 0
        response = requests.get(
            f'{request_url}?start={start_number}',
            headers=BITBUCKET_API_HEADERS,
        )
        response_json = response.json()
        if response.ok:
            branches = [v['displayId'] for v in response_json.get('values', [])]
            is_last_page = response_json.get('isLastPage', True)
            if not is_last_page:
                branches.extend(
                    get_branches(request_url, start_at=response_json.get('nextPageStart')))
            return branches
        elif 'NoSuchRepositoryException' in response_json.get('errors')[0].get('exceptionName'):
            return None

    non_existent_sources = []
    sources_with_invalid_git_url = []
    for src in src_definitions:
        logging.info(f'Checking the {src["id"]} source')
        src_git_url = src['gitUrl']
        if git_url_is_valid(src_git_url):
            branches_request_url = get_request_url(src_git_url)
            git_branches = get_branches(branches_request_url)
            if src not in non_existent_sources:
                if not git_branches or src['branch'] not in git_branches:
                    non_existent_sources.append(src)
        else:
            sources_with_invalid_git_url.append(src)

    (CURRENT_DIR / 'non_existent_sources.json').open('w').write(json.dumps(non_existent_sources, indent=2))
    (CURRENT_DIR / 'sources_with_invalid_git_url.json').open('w').write(json.dumps(sources_with_invalid_git_url, indent=2))
    logging.info(f'Non-existent sources: {len(non_existent_sources)}')


def find_non_existent_filters(build_definitions: list[dict]):
    common_gw_ditavals = list_common_gw_ditavals()
    non_existent_filters = []
    for build in build_definitions:
        if build_filter := build.get('filter'):
            logging.info(f'Checking the build for doc {build["docId"]}')
            if build_filter not in common_gw_ditavals:
                non_existent_filters.append(build)
    (CURRENT_DIR / 'non_existent_filters.json').open('w').write(json.dumps(non_existent_filters, indent=2))
    logging.info(f'Non-existent filters: {len(non_existent_filters)}')


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


def main():
    logging.basicConfig(level=logging.INFO)
    builds = load_builds()
    sources = load_sources()
    # find_ditavals_for_update(builds, sources)
    find_non_existent_filters(builds)
    find_non_existent_sources(sources)


if __name__ == '__main__':
    main()
