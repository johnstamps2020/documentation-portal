import json
import logging
import os
import sys
import time
import urllib.parse
from dataclasses import dataclass
from pathlib import Path

import requests

logging.basicConfig(format='%(message)s', level=logging.INFO)


@dataclass
class BuildInfo:
    id: str
    href: str
    build_type: dict
    state: str
    status: str
    estimated_time_to_finish: int


def get_changed_files() -> list:
    changed_files_file = Path(os.environ['CHANGED_FILES_FILE'])
    return [line.split(':')[0] for line in changed_files_file.open().readlines()]


def get_build_ids(resources: list[str]) -> list[str]:
    build_api_url = os.environ['BUILD_API_URL']
    admin_server_api_key = os.environ['ADMIN_SERVER_API_KEY']
    git_url = os.environ['GIT_URL']
    git_build_branch = os.environ['GIT_BUILD_BRANCH']
    data = {
        'gitUrl': git_url,
        'gitBranch': git_build_branch,
        'resources': resources
    }
    headers = {
        'Content-Type': 'application/json',
        'X-API-Key': admin_server_api_key
    }
    response = requests.get(build_api_url, headers=headers, json=data)
    return sorted([build['build_id'] for build in response.json()])


def start_builds(build_ids: list[str]) -> list[BuildInfo]:
    teamcity_build_queue_url = os.environ['TEAMCITY_BUILD_QUEUE_URL']
    teamcity_api_auth_token = os.environ['TEAMCITY_API_AUTH_TOKEN']
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': f'Bearer {teamcity_api_auth_token}'
    }
    started_builds = []
    for build_id in build_ids:
        data = {
            'buildType': {
                'id': build_id
            }
        }
        response = requests.post(teamcity_build_queue_url, headers=headers, data=json.dumps(data))
        response_json = response.json()
        started_builds.append(BuildInfo(
            id=response_json['id'],
            href=response_json['href'],
            build_type=response_json['buildType'],
            state='',
            status='',
            estimated_time_to_finish=0
        )
        )
    return started_builds


def update_builds_info(builds_to_check: list[BuildInfo]) -> list[BuildInfo]:
    teamcity_build_queue_url = os.environ['TEAMCITY_BUILD_QUEUE_URL']
    teamcity_api_auth_token = os.environ['TEAMCITY_API_AUTH_TOKEN']
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': f'Bearer {teamcity_api_auth_token}'
    }
    checked_builds = []
    for build in builds_to_check:
        full_build_href = urllib.parse.urljoin(teamcity_build_queue_url, build.href)
        response = requests.get(full_build_href, headers=headers)
        build_info = response.json()
        build.state = build_info['state']
        build.status = build_info.get('status', '')
        if build.state.casefold() == 'running':
            build_running_info = build_info.get('running-info', None)
            build.estimated_time_to_finish = abs(int(build_running_info['estimatedTotalSeconds']) - int(
                build_running_info['elapsedSeconds']))
        elif build.state.casefold() == 'finished':
            build.estimated_time_to_finish = 0
        checked_builds.append(build)

    return checked_builds


def coordinate_builds(triggered_builds: list[BuildInfo]):
    logging.info('Checking the status of started builds...')
    triggered_builds_info = update_builds_info(triggered_builds)
    for triggered_build in triggered_builds_info:
        build_type = triggered_build.build_type
        logging.info(f'\nTriggered build ID: {triggered_build.id}'
                     f'\nStatus: {triggered_build.state.upper()}'
                     f'\nEstimated time to finish: {triggered_build.estimated_time_to_finish}'
                     f'\nBuild configuration info:'
                     f'\n\tID: {build_type["id"]}'
                     f'\n\tName: {build_type["projectName"]}'
                     f'\n\tURL: {build_type["webUrl"]}')

    queued_builds = [build for build in triggered_builds_info if build.state.casefold() == 'queued']
    running_builds = [build for build in triggered_builds_info if build.state.casefold() == 'running']
    finished_builds = [build for build in triggered_builds_info if build.state.casefold() == 'finished']

    logging.info(f'\nQueued builds: {len(queued_builds)}'
                 f'\nRunning builds: {len(running_builds)}'
                 f'\nFinished builds: {len(finished_builds)}')
    if running_builds:
        wait_time = max((build_info.estimated_time_to_finish
                         for build_info in running_builds), default=0)
    elif queued_builds:
        wait_time = 30
    else:
        wait_time = 0

    logging.info(f'\nWait time before next check: {wait_time} s')
    time.sleep(wait_time)
    if running_builds or queued_builds:
        coordinate_builds(triggered_builds_info)
    else:
        logging.info('All builds finished')
        unsuccessful_builds = [build for build in triggered_builds_info if
                               build.status.casefold() != 'success']
        if unsuccessful_builds:
            logging.info(
                '\nThe following builds did not finish building successfully:'
                + '\n\t'
                + "\n\t".join(
                    b.build_type['webUrl'] for b in unsuccessful_builds
                )
            )

        sys.exit(0)


def main():
    changed_files = get_changed_files()
    if changed_files:
        builds_to_start = get_build_ids(changed_files)
        if builds_to_start:
            started_builds = start_builds(builds_to_start)
            coordinate_builds(started_builds)
        else:
            logging.info('No build IDs found for the detected changes. Nothing more to do here.')
            sys.exit(0)
    else:
        logging.info('No changes detected. Nothing more to do here.')
        sys.exit(0)


if __name__ == '__main__':
    main()
