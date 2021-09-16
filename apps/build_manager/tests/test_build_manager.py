import os
from dataclasses import dataclass

import pytest

import build_manager.main as build_manager
from pathlib import Path

resources_dir = Path.absolute(Path(__file__)).parent / 'resources'
os.environ['CHANGED_FILES_FILE'] = str(resources_dir / 'input' / 'changed_files.txt')


@pytest.fixture(scope='session')
def create_build_manager_config():
    @dataclass
    class AppConfig:
        _changed_files_file = os.environ.get('CHANGED_FILES_FILE')

        @property
        def changed_files_file(self):
            return Path(self._changed_files_file)

    return AppConfig()


def test_get_changed_files(create_build_manager_config):
    expected_changed_files = [
        'admin/common/c_admin-import-warning-inset.dita',
        'admin/common/c_inset-specify-server-roles.dita',
        'admin/common/c_logging-reports-inset.dita',
        'admin/common/c_rolling-upgrade-backout.dita',
        'admin/common/c_upgrade-full.dita',
        'admin/common/c_upgrade-rolling-inset.dita',
        'admin/common/c_upgrade-rolling.dita',
        'admin/common/t_upgrade-rolling-backout.dita',
        'admin/common_files/guide_intro.dita',
        'admin/topics/c_hv1199521-1.dita',
        'admin/topics/c_hv1199521.dita',
        'admin/topics/c_hv1615492.dita',
        'README.md',
    ]
    changed_files = build_manager.get_changed_files(create_build_manager_config)
    assert sorted(expected_changed_files) == sorted(changed_files)
