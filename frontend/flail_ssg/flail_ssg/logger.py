import logging
from pathlib import Path


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
