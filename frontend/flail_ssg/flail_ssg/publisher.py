import shutil
from pathlib import Path
from typing import List

from flail_ssg.helpers import configure_logger

_log_file = Path.cwd() / 'publisher.log'
_publisher_logger = configure_logger(
    'publisher_logger', 'info', _log_file)


def run_publisher(src_dirs: List[Path], output_dir: Path):
    _publisher_logger.info('PROCESS STARTED: Publish output')

    for src_dir in src_dirs:
        shutil.copytree(src_dir, output_dir, dirs_exist_ok=True)

    _publisher_logger.info('PROCESS ENDED: Publish output')
