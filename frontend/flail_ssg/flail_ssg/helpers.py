import json
import logging
from collections import namedtuple
from pathlib import Path
from typing import Dict, List, Union


def load_json_file(json_file: Path):
    FileConfig = namedtuple(
        'PageConfig',
        ['absolute_path', 'dir', 'json_object']
    )
    json_file_abs_path = json_file.resolve()
    return FileConfig(
        json_file_abs_path,
        json_file_abs_path.parent,
        json.load(json_file_abs_path.open(encoding='utf-8'))
    )


def write_json_object_to_file(json_data: Union[Dict, List], output_file: Path):
    output_file.resolve().open('w', encoding='utf-8').write(json.dumps(json_data, indent=2))


def configure_logger(name: str, logging_level: str, log_path: Path):
    logger_instance = logging.getLogger(name)
    weights = {'critical': 50, 'error': 40,
               'warning': 30, 'info': 20, 'debug': 10}
    try:
        logger_instance.setLevel(weights[logging_level.lower()])
        log_console_handler = logging.StreamHandler()
        log_console_handler.setLevel(weights[logging_level.lower()])
        logger_instance.addHandler(log_console_handler)
        log_file_handler = logging.FileHandler(
            log_path, mode='w', encoding='utf-8')
        log_file_handler.setLevel(weights[logging_level.lower()])
        logger_instance.addHandler(log_file_handler)
        for h in logger_instance.handlers:
            h.setFormatter(logging.Formatter('%(message)s'))
        return logger_instance
    except KeyError as e:
        raise KeyError(f'Logging level not found: "{e.args[0]}". '
                       f'Try one of these levels: critical, error, warning, info, debug')
