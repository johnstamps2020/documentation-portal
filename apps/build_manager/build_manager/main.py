import dataclasses
import json
import logging
import os
import urllib.parse
from dataclasses import dataclass
from pathlib import Path
from typing import Optional, Union

import requests
import sys
import time

_logger = logging.getLogger('build_manager_logger')
_logger.setLevel(logging.INFO)
_console_handler = logging.StreamHandler()
_log_formatter = logging.Formatter('%(levelname)s -- %(message)s')
_console_handler.setFormatter(_log_formatter)
_logger.addHandler(_console_handler)


@dataclass
class AppConfig:
    git_url: str = os.environ.get('GIT_URL')
    git_branch: str = os.environ.get('GIT_BRANCH')
    teamcity_build_branch: str = os.environ.get('TEAMCITY_BUILD_BRANCH')
    teamcity_api_root_url: str = os.environ.get('TEAMCITY_API_ROOT_URL')
    teamcity_build_queue_url: str = urllib.parse.urljoin(
        teamcity_api_root_url, 'buildQueue')
    teamcity_build_types_url: str = urllib.parse.urljoin(
        teamcity_api_root_url, 'buildTypes')
    teamcity_builds_url: str = urllib.parse.urljoin(teamcity_api_root_url, 'builds')
    teamcity_resources_artifact_path = os.environ.get(
        'TEAMCITY_RESOURCES_ARTIFACT_PATH')
    teamcity_affected_project: str = os.environ.get('TEAMCITY_AFFECTED_PROJECT')
    teamcity_template: str = os.environ.get('TEAMCITY_TEMPLATE')
    _teamcity_api_access_token: str = os.environ.get('TEAMCITY_API_ACCESS_TOKEN')
    _bitbucket_access_token: str = os.environ.get("BITBUCKET_ACCESS_TOKEN")
    _changed_files_file: str = os.environ.get('CHANGED_FILES_FILE')
    teamcity_api_headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': f'Bearer {_teamcity_api_access_token}'
    }
    bitbucket_api_headers = {
        'Authorization': f'Bearer {_bitbucket_access_token}'
    }

    @property
    def changed_files_file(self):
        return Path(self._changed_files_file)

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

    def __init__(self, triggered_builds: list[BuildInfo]):
        self.triggered_builds = triggered_builds

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
        return self.number_of_active_builds == 0


@dataclass
class ProcessingRecord:
    type: logging.INFO or logging.WARNING or logging.ERROR
    message: str
    exit_code: Optional[int] = None


def check_processing_result(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        if type(result) is ProcessingRecord:
            _logger.log(result.type, result.message)
            if result.exit_code is not None:
                sys.exit(result.exit_code)
        return result

    return wrapper


@check_processing_result
def get_changes_from_pull_request(app_config: AppConfig) -> Union[list[str], ProcessingRecord]:
    git_url_path = urllib.parse.urlparse(app_config.git_url).path
    project_key = git_url_path.split('/')[1]
    repository_name = git_url_path.split('/')[2].replace('.git', '')
    url = f'https://stash.guidewire.com/rest/api/1.0/projects/{project_key}/repos/{repository_name}/{app_config.teamcity_build_branch}/changes'
    response = requests.get(
        url,
        headers=app_config.bitbucket_api_headers,
    )
    changes = response.json().get('values', [])
    return (changes and [change['path']['toString'] for change in changes]) or ProcessingRecord(
        type=logging.INFO,
        message='No changes found in the pull request history. Nothing more to do here.',
        exit_code=0
    )


@check_processing_result
def get_changed_files(app_config: AppConfig) -> Union[list[str], ProcessingRecord]:
    changed_files_file_content = app_config.changed_files_file.open().readlines()
    changed_files = [line.split(':')[0] for line in changed_files_file_content]
    _logger.info(f'Number of VCS changes: {len(changed_files)}')
    if changed_files:
        return changed_files
    return ProcessingRecord(
        type=logging.INFO,
        message='No changes found in the VCS history. Nothing more to do here.',
        exit_code=0
    )


@check_processing_result
def get_build_types(app_config: AppConfig) -> Union[list[str], ProcessingRecord]:
    vcs_root_instance_locator = f'vcsRootInstance:(property:(name:url,value:{app_config.git_url}),property:(name:branch,value:{app_config.git_branch}))'
    template_locator = f'template:(id:{app_config.teamcity_template})'
    affected_project_locator = f'affectedProject:(id:{app_config.teamcity_affected_project})'
    payload = {
        'locator': f'{vcs_root_instance_locator},{template_locator},{affected_project_locator}',
    }
    build_types_response = requests.get(
        app_config.teamcity_build_types_url,
        headers=app_config.teamcity_api_headers,
        params=payload
    )
    build_types_ids = sorted(
        build_type['id'] for build_type in build_types_response.json()['buildType'])
    if build_types_ids:
        return build_types_ids
    return ProcessingRecord(
        type=logging.INFO,
        message='No build type IDs found for the VCS root. Nothing more to do here.',
        exit_code=0
    )


@check_processing_result
def get_build_type_builds(app_config: AppConfig, build_type_id: str) -> Union[list[str], ProcessingRecord]:
    def run_request(branch_locator: str):
        default_filter_locator = 'defaultFilter:false'
        status_locator = 'status:success'
        count_locator = 'count:1'
        builds_response = requests.get(
            f'{app_config.teamcity_build_types_url}/id:{build_type_id}/builds?locator={branch_locator},{default_filter_locator},{status_locator},{count_locator}',
            headers=app_config.teamcity_api_headers)
        return builds_response.json()['build']

    builds_for_build_branch = run_request(f'branch:{app_config.teamcity_build_branch}')
    if builds_for_build_branch:
        return builds_for_build_branch
    else:
        builds_for_default_branch = run_request(f'branch:default:true')
        return builds_for_default_branch or ProcessingRecord(
            type=logging.INFO,
            message=f'No successful builds found for {build_type_id}'
        )


@check_processing_result
def get_matching_build_resources(app_config: AppConfig, build_type_id: str, build_id: str,
                                 changed_resources: list[str]) -> \
        Union[bool, ProcessingRecord]:
    latest_build_resources = requests.get(
        f'{app_config.teamcity_builds_url}/id:{build_id}/artifacts/content/{app_config.teamcity_resources_artifact_path}',
        headers=app_config.teamcity_api_headers,
        allow_redirects=True
    )
    if latest_build_resources.status_code == 404:
        return ProcessingRecord(
            type=logging.INFO,
            message=f'Latest build ({build_id}) for {build_type_id} does not have the {app_config.teamcity_resources_artifact_path} artifact')

    build_resources = json.loads(latest_build_resources.text)['resources']
    return bool(next((build_resource for build_resource in build_resources if
                      build_resource in changed_resources), False))


@check_processing_result
def get_build_ids(app_config: AppConfig, changed_resources: list[str]) -> Union[list[str] or ProcessingRecord]:
    build_types_ids = get_build_types(app_config)
    all_builds = []
    for build_type_id in build_types_ids:
        builds = get_build_type_builds(app_config, build_type_id)
        builds_found = builds and type(builds) is not ProcessingRecord
        if builds_found:
            latest_build_id = builds[0]['id']
            matching_resources = get_matching_build_resources(app_config, build_type_id, latest_build_id,
                                                              changed_resources)
            artifact_path_exists = type(
                matching_resources) is not ProcessingRecord
            if (
                    artifact_path_exists
                    and matching_resources
                    or not artifact_path_exists
            ):
                all_builds.append(build_type_id)
        else:
            all_builds.append(build_type_id)
    if all_builds:
        _logger.info(f'Number of builds to start: {len(all_builds)}')
        return all_builds
    return ProcessingRecord(
        type=logging.INFO,
        message='No builds to start. Nothing more to do here.',
        exit_code=0,
    )


@check_processing_result
def start_build(app_config: AppConfig, build_id: str) -> Union[BuildInfo or ProcessingRecord]:
    data = {
        'branchName': app_config.teamcity_build_branch,
        'buildType': {
            'id': build_id
        }
    }
    response = requests.post(
        app_config.teamcity_build_queue_url,
        headers=app_config.teamcity_api_headers,
        data=json.dumps(data))
    if response.ok:
        response_json = response.json()
        return BuildInfo(
            id=str(response_json['id']),
            href=response_json['href'],
            build_type=response_json['buildType'],
            state='',
            status='',
            estimated_time_to_finish=0
        )
    return ProcessingRecord(
        type=logging.ERROR,
        message=f'Unable to start build {build_id}: {response.text}')


@check_processing_result
def start_all_builds(app_config: AppConfig, build_type_ids: list[str]) -> Union[list[BuildInfo] or ProcessingRecord]:
    started_builds_results = (start_build(app_config, build_type_id)
                              for build_type_id in build_type_ids)
    started_builds = [
        result for result in started_builds_results if type(result) is BuildInfo]

    if started_builds:
        started_builds_ids = '\n\t'.join(
            f"{build.id} (build type: {build.build_type['id']})" for build in started_builds)
        _logger.info(
            f'Started builds: {len(started_builds)} '
            + '\n\t'
            + started_builds_ids
        )
        return started_builds

    return ProcessingRecord(
        type=logging.ERROR,
        message='All builds failed to start. Nothing more to do here.',
        exit_code=1
    )


@check_processing_result
def update_build(app_config: AppConfig, build: BuildInfo) -> Union[BuildInfo, ProcessingRecord]:
    try:
        full_build_href = urllib.parse.urljoin(
            app_config.teamcity_build_queue_url, build.href)
        response = requests.get(
            full_build_href, headers=app_config.teamcity_api_headers)
        build_info = response.json()
        build.state = build_info['state']
        build.status = build_info.get('status', '')
        if build.state.casefold() == 'running':
            build_running_info = build_info.get('running-info', None)
            if 'estimatedTotalSeconds' in build_running_info:
                build.estimated_time_to_finish = abs(int(build_running_info['estimatedTotalSeconds']) - int(
                    build_running_info['elapsedSeconds']))
            else:
                build.estimated_time_to_finish = 30
        elif build.state.casefold() == 'finished':
            build.estimated_time_to_finish = 0
        return build
    except Exception as e:
        return ProcessingRecord(
            type=logging.ERROR,
            message=f'Unable to update info for build {build.id}: {e}')


@check_processing_result
def update_all_builds(app_config: AppConfig, builds: list[BuildInfo]) -> Union[list[BuildInfo], ProcessingRecord]:
    updated_builds_results = (update_build(app_config, build)
                              for build in builds)
    updated_builds = [
        result for result in updated_builds_results if type(result) is BuildInfo]

    if updated_builds:
        updated_builds_ids = '\n\t'.join(build.id for build in updated_builds)
        _logger.info(
            f'Updated info for builds: {len(updated_builds)} '
            + '\n\t'
            + updated_builds_ids
        )
        return updated_builds

    return ProcessingRecord(
        type=logging.ERROR,
        message='All builds failed to update. Nothing more to do here.',
        exit_code=1
    )


@check_processing_result
def watch_builds(app_config: AppConfig, build_pipeline: BuildPipeline) -> ProcessingRecord:
    _logger.info('>>>>>>>>>>')
    _logger.info('Checking the status of started builds...')
    updated_triggered_builds = update_all_builds(
        app_config, build_pipeline.triggered_builds)
    updated_build_pipeline = BuildPipeline(updated_triggered_builds)
    _logger.info(f'Queued builds: {updated_build_pipeline.number_of_queued_builds}'
                 f' | Running builds: {updated_build_pipeline.number_of_running_builds}'
                 f' | Finished builds: {updated_build_pipeline.number_of_finished_builds}')

    for triggered_build in updated_build_pipeline.triggered_builds:
        build_type = triggered_build.build_type
        triggered_build_details = [f'Triggered build ID: {triggered_build.id}',
                                   f'Status: {triggered_build.state.upper()}',
                                   f'Estimated time to finish: {triggered_build.estimated_time_to_finish}',
                                   f'Build type ID: {build_type["id"]}',
                                   f'Build type URL: {build_type["webUrl"]}']
        _logger.info('\n\t\t'.join(triggered_build_details))

    _logger.info(
        f'Wait time before next check: {updated_build_pipeline.wait_time} s')
    time.sleep(updated_build_pipeline.wait_time)

    if updated_build_pipeline.all_builds_finished:
        if updated_build_pipeline.unsuccessful_builds:
            build_types_web_urls = '\n\t'.join(
                b.build_type['webUrl'] for b in updated_build_pipeline.unsuccessful_builds)
            return ProcessingRecord(
                type=logging.ERROR,
                message='All started builds finished.'
                        + '\nThe following builds did not finish building successfully:'
                        + '\n\t'
                        + build_types_web_urls,
                exit_code=1
            )

        return ProcessingRecord(
            type=logging.INFO,
            message='All started builds finished successfully',
            exit_code=0
        )
    else:
        watch_builds(app_config, updated_build_pipeline)


def main():
    build_manager_config = AppConfig().get_app_config()
    is_validation_listener = build_manager_config.teamcity_build_branch != build_manager_config.git_branch
    changed_files = (is_validation_listener and get_changes_from_pull_request(
        build_manager_config)) or get_changed_files(build_manager_config)
    build_ids_to_start = get_build_ids(build_manager_config, changed_files)
    started_builds = start_all_builds(build_manager_config, build_ids_to_start)
    watch_builds(build_manager_config, BuildPipeline(started_builds))


if __name__ == '__main__':
    main()
