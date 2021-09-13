import os

import build_manager.main as build_manager
from pathlib import Path

resources_dir = Path.absolute(Path(__file__)).parent / 'resources'
os.environ['CHANGED_FILES_FILE'] = str(resources_dir / 'input' / 'changed_files.txt')

changed_files = build_manager.get_changed_files()
build_ids = build_manager.get_build_ids(changed_files)
started_builds_ids = build_manager.start_builds(build_ids)
build_manager.coordinate_builds(started_builds_ids)
print('done')
