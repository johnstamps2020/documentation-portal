import json
import logging
from pathlib import Path

CURRENT_DIR = Path(__file__).parent
CONFIG_DIR = CURRENT_DIR / 'config'


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


def get_git_info_for_src(src_id: str, src_definitions: list[dict]) -> dict:
    return next(({
        'gitUrl': src['gitUrl'],
        'gitBranch': src['branch']
    } for src in src_definitions if src['id'] == src_id), None)


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    builds = load_builds()
    sources = load_sources()
    common_gw_ditavals = list_common_gw_ditavals()
    ditavals_to_update = []
    for build in builds:
        if build_filter := build.get('filter'):
            if 'common-gw' not in build_filter:
                git_src = get_git_info_for_src(build['srcId'], sources)
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
