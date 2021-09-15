import copy
import json
import logging
import os
import sys
import time
import urllib.parse
from pathlib import Path

import requests

logging.basicConfig(format='%(message)s', level=logging.INFO)


def get_changed_files() -> list:
    changed_files_file = Path(os.environ['CHANGED_FILES_FILE'])
    return [line.split(':')[0] for line in changed_files_file.open().readlines()]


def get_build_ids(resources: list) -> list:
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
    return [build['build_id'] for build in response.json()]


def start_builds(build_ids: list):
    teamcity_build_queue_url = os.environ['TEAMCITY_BUILD_QUEUE_URL']
    teamcity_api_auth_token = os.environ['TEAMCITY_API_AUTH_TOKEN']
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': f'Bearer {teamcity_api_auth_token}'
    }
    started_builds_ids = []
    for build_id in build_ids:
        data = {
            'buildType': {
                'id': build_id
            }
        }
        response = requests.post(teamcity_build_queue_url, headers=headers, data=json.dumps(data))
        response_json = response.json()
        started_builds_ids.append(
            {
                'id': response_json['id'],
                'href': response_json['href'],
                'buildType': response_json['buildType']
            }
        )
    return started_builds_ids


def coordinate_builds(builds_info: list[dict], wait_seconds: int = 0):
    teamcity_build_queue_url = os.environ['TEAMCITY_BUILD_QUEUE_URL']
    teamcity_api_auth_token = os.environ['TEAMCITY_API_AUTH_TOKEN']
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': f'Bearer {teamcity_api_auth_token}'
    }

    updated_builds_info = copy.deepcopy(builds_info)
    logging.info(f'Wait time before next check: {wait_seconds} s')
    time.sleep(wait_seconds)
    logging.info('Checking the status of started builds...\n')
    unsuccessful_builds = []
    wait_times = [0]
    for build in updated_builds_info:
        build_id = build['id']
        build_type = build['buildType']
        full_build_href = urllib.parse.urljoin(teamcity_build_queue_url, build['href'])
        logging.info(f'Triggered build ID: {build_id}'
                     f'\nBuild configuration info:'
                     f'\n\tID: {build_type["id"]}'
                     f'\n\tName: {build_type["projectName"]}'
                     f'\n\tURL: {build_type["webUrl"]}')
        response = requests.get(full_build_href, headers=headers)
        build_info = response.json()
        build_state = build_info['state']
        logging.info(f'Status: {build_state.upper()}.')
        if build_state == 'finished':
            updated_builds_info.remove(build)
            if build_info['status'].casefold() != 'success':
                unsuccessful_builds.append(full_build_href)
        elif build_state == 'running':
            build_running_info = build_info['running-info']
            estimated_time_left_seconds = int(build_running_info['estimatedTotalSeconds']) - int(
                build_running_info['elapsedSeconds'])
            if estimated_time_left_seconds > 0:
                wait_times.append(estimated_time_left_seconds)
                logging.info(f'Estimated time to finish: {estimated_time_left_seconds} s)')
        else:
            wait_times.append(10)
        logging.info('\n')

    if updated_builds_info:
        coordinate_builds(updated_builds_info, max(wait_times))
    else:
        logging.info('All builds finished')
        if unsuccessful_builds:
            logging.info('The following builds did not finish building successfully' + "\n".join(unsuccessful_builds))
        return True


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
