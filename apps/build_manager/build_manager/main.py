import copy
import dataclasses
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
class AppConfig:
    build_api_url: str = os.environ.get('BUILD_API_URL')
    admin_server_api_key: str = os.environ.get('ADMIN_SERVER_API_KEY')
    git_url: str = os.environ.get('GIT_URL')
    git_build_branch: str = os.environ.get('GIT_BUILD_BRANCH')
    teamcity_build_queue_url = os.environ.get('TEAMCITY_BUILD_QUEUE_URL')
    _teamcity_api_auth_token = os.environ.get('TEAMCITY_API_AUTH_TOKEN')
    _changed_files_file = os.environ.get('CHANGED_FILES_FILE')
    build_api_headers = {
        'Content-Type': 'application/json',
        'X-API-Key': admin_server_api_key
    }
    teamcity_api_headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': f'Bearer {_teamcity_api_auth_token}'
    }

    @property
    def changed_files_file(self):
        return Path(self._changed_files_file)

    def get_build_api_data(self, resources):
        return {
            'gitUrl': self.git_url,
            'gitBranch': self.git_build_branch,
            'resources': resources
        }

    def get_app_config(self):
        missing_parameters = [
            field.name.upper().lstrip('_') for field in dataclasses.fields(self)
            if not getattr(self, field.name)
        ]
        if missing_parameters:
            raise SystemError(f'Missing environment variables:'
                              f'\n{", ".join(missing_parameters)}')
        return self


@dataclass
class BuildInfo:
    id: str
    href: str
    build_type: dict
    state: str
    status: str
    estimated_time_to_finish: int


def get_changed_files(app_config: AppConfig) -> list[str]:
    return [line.split(':')[0] for line in app_config.changed_files_file.open().readlines()]


def get_build_ids(app_config: AppConfig, resources: list[str]) -> list[str]:
    response = requests.get(
        app_config.build_api_url,
        headers=app_config.build_api_headers,
        json=app_config.get_build_api_data(resources))
    return sorted([build['build_id'] for build in response.json()])


def start_builds(app_config: AppConfig, build_ids: list[str]) -> list[BuildInfo]:
    started_builds = []
    for build_id in build_ids:
        data = {
            'buildType': {
                'id': build_id
            }
        }
        response = requests.post(
            app_config.teamcity_build_queue_url,
            headers=app_config.teamcity_api_headers,
            data=json.dumps(data))
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


def update_builds_info(app_config: AppConfig, builds_to_check: list[BuildInfo]) -> list[BuildInfo]:
    checked_builds = []
    for build in builds_to_check:
        full_build_href = urllib.parse.urljoin(app_config.teamcity_build_queue_url, build.href)
        response = requests.get(full_build_href, headers=app_config.teamcity_api_headers)
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


def coordinate_builds(app_config: AppConfig, waiting_builds: list[str], triggered_builds: list[BuildInfo]):
    queued_builds = [build for build in triggered_builds if build.state.casefold() == 'queued']
    running_builds = [build for build in triggered_builds if build.state.casefold() == 'running']
    finished_builds = [build for build in triggered_builds if build.state.casefold() == 'finished']

    logging.info(f'\nWaiting builds: {len(waiting_builds)}'
                 f'\nQueued builds: {len(queued_builds)}'
                 f'\nRunning builds: {len(running_builds)}'
                 f'\nFinished builds: {len(finished_builds)}')

    for triggered_build in triggered_builds:
        build_type = triggered_build.build_type
        logging.info(f'\nTriggered build ID: {triggered_build.id}'
                     f'\nStatus: {triggered_build.state.upper()}'
                     f'\nEstimated time to finish: {triggered_build.estimated_time_to_finish}'
                     f'\nBuild configuration info:'
                     f'\n\tID: {build_type["id"]}'
                     f'\n\tName: {build_type["projectName"]}'
                     f'\n\tURL: {build_type["webUrl"]}')

    maximum_number_of_active_builds = 3
    active_builds = [
        build
        for build in triggered_builds
        if build.state.casefold() in ['queued', 'running']
    ]

    number_of_empty_slots = maximum_number_of_active_builds - len(active_builds)
    logging.info(f'\nNumber of empty slots for triggering builds: {number_of_empty_slots}')
    planned_builds = []
    updated_waiting_builds = copy.deepcopy(waiting_builds)
    for build in waiting_builds:
        if number_of_empty_slots > 0:
            planned_builds.append(build)
            updated_waiting_builds.remove(build)
            number_of_empty_slots -= 1
    if planned_builds:
        started_builds = start_builds(app_config, planned_builds)
        logging.info(f'Number of newly started builds: {len(started_builds)}')
        triggered_builds += started_builds

    if running_builds:
        wait_time = max((build_info.estimated_time_to_finish
                         for build_info in running_builds), default=0)
    elif queued_builds:
        wait_time = 30
    else:
        wait_time = 0

    logging.info(f'\nWait time before next check: {wait_time} s')
    time.sleep(wait_time)

    logging.info('Checking the status of all triggered builds...')
    updated_triggered_builds = update_builds_info(app_config, triggered_builds)
    updated_active_builds = [
        build
        for build in updated_triggered_builds
        if build.state.casefold() in ['queued', 'running']
    ]
    if updated_waiting_builds or updated_active_builds:
        coordinate_builds(app_config, updated_waiting_builds, updated_triggered_builds)
    else:
        logging.info('All builds finished')
        unsuccessful_builds = [build for build in updated_triggered_builds if
                               build.status.casefold() != 'success']
        if unsuccessful_builds:
            logging.warning(
                '\nThe following builds did not finish building successfully:'
                + '\n\t'
                + "\n\t".join(
                    b.build_type['webUrl'] for b in unsuccessful_builds
                )
            )

        sys.exit(0)


def main():
    build_manager_config = AppConfig().get_app_config()
    changed_files = get_changed_files(build_manager_config)
    if changed_files:
        builds_to_start = get_build_ids(build_manager_config, changed_files)
        if builds_to_start:
            coordinate_builds(build_manager_config, builds_to_start, [])
        else:
            logging.info('No build IDs found for the detected changes. Nothing more to do here.')
            sys.exit(0)
    else:
        logging.info('No changes detected. Nothing more to do here.')
        sys.exit(0)


if __name__ == '__main__':
    main()
