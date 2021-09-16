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


@dataclass
class BuildPipeline:
    _maximum_number_of_active_builds: int = 3

    def __init__(self, not_started_builds: list[str], started_builds: list[BuildInfo]):
        self.waiting_builds = not_started_builds
        self.triggered_builds = started_builds

    @property
    def queued_builds(self):
        return [build for build in self.triggered_builds if build.state.casefold() == 'queued']

    @property
    def running_builds(self):
        return [build for build in self.triggered_builds if build.state.casefold() == 'running']

    @property
    def finished_builds(self):
        return [build for build in self.triggered_builds if build.state.casefold() == 'finished']

    @property
    def active_builds(self):
        return self.queued_builds + self.running_builds

    @property
    def unsuccessful_builds(self):
        return [build for build in self.triggered_builds if build.status.casefold() != 'success']

    @property
    def number_of_waiting_builds(self):
        return len(self.waiting_builds)

    @property
    def number_of_queued_builds(self):
        return len(self.queued_builds)

    @property
    def number_of_running_builds(self):
        return len(self.running_builds)

    @property
    def number_of_finished_builds(self):
        return len(self.finished_builds)

    @property
    def number_of_active_builds(self):
        return len(self.active_builds)

    @property
    def number_of_empty_slots(self):
        return self._maximum_number_of_active_builds - self.number_of_active_builds

    @property
    def wait_time(self):
        if self.running_builds:
            return max((build_info.estimated_time_to_finish
                        for build_info in self.running_builds), default=0)
        elif self.queued_builds:
            return 30
        else:
            return 0

    @property
    def all_builds_finished(self):
        return self.number_of_queued_builds + self.number_of_running_builds + self.number_of_waiting_builds == 0


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


def coordinate_builds(app_config: AppConfig, all_builds: BuildPipeline):
    logging.info(f'\nWaiting builds: {all_builds.number_of_waiting_builds}'
                 f'\nQueued builds: {all_builds.number_of_queued_builds}'
                 f'\nRunning builds: {all_builds.number_of_running_builds}'
                 f'\nFinished builds: {all_builds.number_of_finished_builds}')

    for triggered_build in all_builds.triggered_builds:
        build_type = triggered_build.build_type
        logging.info(f'\nTriggered build ID: {triggered_build.id}'
                     f'\nStatus: {triggered_build.state.upper()}'
                     f'\nEstimated time to finish: {triggered_build.estimated_time_to_finish}'
                     f'\nBuild configuration info:'
                     f'\n\tID: {build_type["id"]}'
                     f'\n\tName: {build_type["projectName"]}'
                     f'\n\tURL: {build_type["webUrl"]}')

    logging.info(f'\nNumber of empty slots for triggering builds: {all_builds.number_of_empty_slots}')
    planned_builds = []
    updated_waiting_builds = copy.deepcopy(all_builds.waiting_builds)
    available_slots = all_builds.number_of_empty_slots
    all_started_builds = all_builds.triggered_builds
    for build in all_builds.waiting_builds:
        if available_slots > 0:
            planned_builds.append(build)
            updated_waiting_builds.remove(build)
            available_slots -= 1
    if planned_builds:
        started_builds = start_builds(app_config, planned_builds)
        logging.info(f'Number of newly started builds: {len(started_builds)}')
        all_started_builds += started_builds

    logging.info(f'\nWait time before next check: {all_builds.wait_time} s')
    time.sleep(all_builds.wait_time)

    logging.info('Checking the status of all triggered builds...')
    updated_triggered_builds = update_builds_info(app_config, all_started_builds)
    updated_build_pipeline = BuildPipeline(updated_waiting_builds, updated_triggered_builds)

    if updated_build_pipeline.all_builds_finished:
        logging.info('All builds finished')
        if updated_build_pipeline.unsuccessful_builds:
            logging.warning(
                '\nThe following builds did not finish building successfully:'
                + '\n\t'
                + "\n\t".join(
                    b.build_type['webUrl'] for b in updated_build_pipeline.unsuccessful_builds
                )
            )

        sys.exit(0)
    else:
        coordinate_builds(app_config, updated_build_pipeline)


def main():
    build_manager_config = AppConfig().get_app_config()
    changed_files = get_changed_files(build_manager_config)
    if changed_files:
        builds_to_start = get_build_ids(build_manager_config, changed_files)
        if builds_to_start:
            initial_build_pipeline = BuildPipeline(builds_to_start, [])
            coordinate_builds(build_manager_config, initial_build_pipeline)
        else:
            logging.info('No build IDs found for the detected changes. Nothing more to do here.')
            sys.exit(0)
    else:
        logging.info('No changes detected. Nothing more to do here.')
        sys.exit(0)


if __name__ == '__main__':
    main()
