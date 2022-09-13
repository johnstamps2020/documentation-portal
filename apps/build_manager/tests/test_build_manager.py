import pytest

import build_manager.main as build_manager


@pytest.fixture(scope='module')
def build_manager_config():
    return build_manager.AppConfig(
        git_url='ssh://git@stash.guidewire.com/docsources/writing-with-git.git',
        git_branch='refs/heads/release/test-1',
        teamcity_resources_artifact_path='json/build-data.json',
        teamcity_affected_project='DocumentationTools_DocumentationPortal_writingwithgitsrc',
        teamcity_template='DocumentationTools_DocumentationPortal_Validationlistener',
        teamcity_build_branch='pull-requests/1',
    )


def test_app_config(build_manager_config):
    bitbucket_root_api_url = 'https://stash.guidewire.com/rest/api/1.0/projects'
    bitbucket_project_key = 'docsources'
    bitbucket_repository_name = 'writing-with-git'
    bitbucket_base_url = f'{bitbucket_root_api_url}/{bitbucket_project_key}/repos/{bitbucket_repository_name}'
    bitbucket_branch_name = 'refs%2Fheads%2Frelease%2Ftest-1'
    assert build_manager_config.bitbucket_branch_commits_url == f'{bitbucket_base_url}' \
                                                                f'/commits?until={bitbucket_branch_name}' \
                                                                '&merges=include&limit=1'
    assert build_manager_config.get_bitbucket_pull_request_changes_url(start=0) == f'{bitbucket_base_url}' \
                                                                                   f'/{build_manager_config.teamcity_build_branch}/changes?start=0'


def test_validations_build_manager(build_manager_config):
    # Pull request doesn't exist so a ProcessingRecord should be returned and the app should exit with code 0
    with pytest.raises(SystemExit) as e:
        build_manager.get_changed_files(build_manager_config)
    assert e.value.code == 0

    # Git branch doesn't exist so a ProcessingRecord should be returned and the app should exit with code 0
    with pytest.raises(SystemExit) as e:
        build_manager.get_build_types(build_manager_config)
    assert e.value.code == 0
