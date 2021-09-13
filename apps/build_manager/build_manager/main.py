import copy
import json
import logging
import os
import urllib.parse

import requests
from pathlib import Path

import time

logging.basicConfig(format='%(levelname)s:%(message)s', level=logging.INFO)


def get_changed_files():
    changed_files_file = Path(os.environ['CHANGED_FILES_FILE'])
    return [line.split(':')[0] for line in changed_files_file.open().readlines()]


def get_build_ids(resources: list):
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
                'href': response_json['href']

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
    logging.info('Checking the status of started builds...')
    unsuccessful_builds = []
    wait_times = [0]
    for build in updated_builds_info:
        build_id = build['id']
        full_build_href = urllib.parse.urljoin(teamcity_build_queue_url, build['href'])
        response = requests.get(full_build_href, headers=headers)
        build_info = response.json()
        if build_info['state'] == 'finished':
            updated_builds_info.remove(build)
            if build_info['status'].casefold() != 'success':
                unsuccessful_builds.append(full_build_href)
            logging.info(f'Build {build_id} finished.')
        elif build_info['state'] == 'running':
            build_running_info = build_info['running-info']
            estimated_time_left_seconds = int(build_running_info['estimatedTotalSeconds']) - int(
                build_running_info['elapsedSeconds'])
            if estimated_time_left_seconds > 0:
                wait_times.append(estimated_time_left_seconds)
                logging.info(f'Estimated time left for build {build_id}: {estimated_time_left_seconds} s')
        elif build_info['state'] == 'queued':
            wait_times.append(10)
            logging.info(f'Build {build_id} is waiting in the queue.')
    if updated_builds_info:
        coordinate_builds(updated_builds_info, max(wait_times))
    else:
        logging.info('All builds finished')
        if unsuccessful_builds:
            logging.info('The following builds did not finish building successfully' + "\n".join(unsuccessful_builds))
        return True


def main():
    changed_files = get_changed_files()
    builds_to_start = get_build_ids(changed_files)
    if builds_to_start:
        started_builds = start_builds(builds_to_start)
        coordinate_builds(started_builds)
    else:
        return True


if __name__ == '__main__':
    main()
