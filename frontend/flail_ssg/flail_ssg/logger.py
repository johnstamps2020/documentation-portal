import logging
from pathlib import Path


def create_logger(name: str):
    logger_instance = logging.getLogger(name)
    return logger_instance


def configure_logger(logger_instance: logging.Logger, logging_level: str, log_path: Path = None):
    weights = {'critical': 50, 'error': 40, 'warning': 30, 'info': 20, 'debug': 10}
    if logging_level.lower() in weights:
        logger_instance.setLevel(weights[logging_level.lower()])
        log_console_handler = logging.StreamHandler()
        log_console_handler.setLevel(weights[logging_level.lower()])
        logger_instance.addHandler(log_console_handler)
        if log_path is not None:
            log_file_handler = logging.FileHandler(log_path)
            log_file_handler.setLevel(weights[logging_level.lower()])
            logger_instance.addHandler(log_file_handler)
        for h in logger_instance.handlers:
            h.setFormatter(logging.Formatter('%(message)s'))
    else:
        logging.error('Logging level not found. Try one of these levels: critical, error, warning, info, debug')
