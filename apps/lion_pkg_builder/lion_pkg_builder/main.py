import dataclasses
import json
import logging
import os
import urllib.parse
from dataclasses import dataclass
from pathlib import Path
from shutil import copyfile, make_archive
from typing import Dict, Optional, Union

import requests
import sys
import time

_logger = logging.getLogger('lion_pkg_builder_logger')
_logger.setLevel(logging.INFO)
_console_handler = logging.StreamHandler()
_log_formatter = logging.Formatter('%(levelname)s -- %(message)s')
_console_handler.setFormatter(_log_formatter)
_logger.addHandler(_console_handler)


@dataclass
class AppConfig:
    src_root: str = Path(os.environ.get('WORKING_DIR'))
    zip_dir: str = Path(os.environ.get('ZIP_SRC_DIR'))
    out_path: str = Path(os.environ.get('OUTPUT_PATH'))
    teamcity_build_type_id = os.environ.get('TC_BUILD_TYPE_ID')
    _teamcity_api_auth_token = os.environ.get('TEAMCITY_API_AUTH_TOKEN')
    teamcity_api_root_url = os.environ.get('TEAMCITY_API_ROOT_URL')
    teamcity_resources_artifact_path = os.environ.get(
        'TEAMCITY_RESOURCES_ARTIFACT_PATH')
    teamcity_build_queue_url = urllib.parse.urljoin(
        teamcity_api_root_url, 'buildQueue')
    teamcity_build_types_url = urllib.parse.urljoin(
        teamcity_api_root_url, 'buildTypes')
    teamcity_builds_url = urllib.parse.urljoin(teamcity_api_root_url, 'builds')
    teamcity_api_headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': f'Bearer {_teamcity_api_auth_token}'
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
    def successful_builds(self):
        return [build for build in self.triggered_builds if build.status.casefold() == 'success']

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
def get_build_type_build(app_config: AppConfig) -> Union[str, ProcessingRecord]:
    default_filter_locator = 'defaultFilter:true'
    status_locator = 'status:success'
    lookup_limit_locator = 'lookupLimit:1'
    build_response = requests.get(
        f'{app_config.teamcity_build_types_url}/id:{app_config.teamcity_build_type_id}/builds?locator={default_filter_locator},{status_locator},{lookup_limit_locator}',
        headers=app_config.teamcity_api_headers)
    build = build_response.json()['build']
    if build:
        return build
    return ProcessingRecord(
        type=logging.INFO,
        message=f'No successful builds found for {app_config.teamcity_build_type_id}'
    )


@check_processing_result
def get_build_resources(app_config: AppConfig, build_id: str) -> \
        Union[Dict, ProcessingRecord]:
    latest_build_resources = requests.get(
        f'{app_config.teamcity_builds_url}/id:{build_id}/artifacts/content/{app_config.teamcity_resources_artifact_path}',
        headers=app_config.teamcity_api_headers,
        allow_redirects=True
    )
    if latest_build_resources.status_code == 404:
        return ProcessingRecord(
            type=logging.INFO,
            message=f'Latest build ({build_id}) for {app_config.teamcity_build_type_id} does not have the {app_config.teamcity_resources_artifact_path} artifact')

    build_resources = json.loads(latest_build_resources.text)['resources']
    return build_resources


@check_processing_result
def start_build(app_config: AppConfig, build_id: str) -> Union[BuildInfo or ProcessingRecord]:
    data = {
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
            build.estimated_time_to_finish = abs(int(build_running_info['estimatedTotalSeconds']) - int(
                build_running_info['elapsedSeconds']))
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
def watch_builds(app_config: AppConfig, build_pipeline: BuildPipeline) -> Union[list[BuildInfo], ProcessingRecord]:
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
        return updated_build_pipeline.successful_builds
    else:
        return watch_builds(app_config, updated_build_pipeline)


@check_processing_result
def create_zip_package(app_config: AppConfig, build_resources: Dict) -> ProcessingRecord:
    try:
        print(
            f'Copying source files from {app_config.src_root} to {app_config.src_root}/{app_config.zip_dir}')
        for build_resource in build_resources:
            src_file = Path(app_config.src_root / Path(build_resource))
            dest_file = Path(app_config.src_root /
                             app_config.zip_dir / Path(build_resource))
            Path.mkdir(dest_file.parent, parents=True, exist_ok=True)
            copyfile(src_file, dest_file)
            print(f'{src_file} to {dest_file}')
        Path.mkdir(app_config.src_root / app_config.out_path)
        make_archive(app_config.src_root / app_config.out_path / 'l10n_package', 'zip', app_config.src_root /
                     app_config.zip_dir)
        return ProcessingRecord(
            type=logging.INFO,
            message='ZIP archive created.',
            exit_code=0
        )
    except:
        return ProcessingRecord(
            type=logging.ERROR,
            message='Error during ZIP archive creation.',
            exit_code=1
        )


@check_processing_result
def run_build_for_resources(app_config: AppConfig) -> Union[Dict, ProcessingRecord]:
    try:
        started_builds = start_all_builds(
            app_config, [app_config.teamcity_build_type_id])
        updated_builds = watch_builds(app_config,
                                      BuildPipeline(started_builds))
        updated_build_id = updated_builds[0].id
        time.sleep(10)
        return get_build_resources(app_config, updated_build_id)
    except:
        return ProcessingRecord(
            type=logging.ERROR,
            message='Failed to retrieve build resources',
            exit_code=1
        )


def main():
    lion_pkg_builder_config = AppConfig().get_app_config()
    latest_staging_build = get_build_type_build(lion_pkg_builder_config)
    if (not isinstance(latest_staging_build, ProcessingRecord)):
        build_resources = get_build_resources(
            lion_pkg_builder_config, latest_staging_build[0]['id'])
        if (isinstance(build_resources, ProcessingRecord)):
            build_resources = run_build_for_resources(lion_pkg_builder_config)
    else:
        build_resources = run_build_for_resources(lion_pkg_builder_config)
    create_zip_package(lion_pkg_builder_config, build_resources)


if __name__ == '__main__':
    main()
