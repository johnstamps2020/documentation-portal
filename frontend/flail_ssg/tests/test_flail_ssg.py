from pathlib import Path

from flail_ssg.validator import run_validator


class AppConfig:
    _frontend_dir = Path(__file__).parent.parent.parent
    send_bouncer_home = False
    pages_dir = _frontend_dir / 'pages'
    docs_config_file = _frontend_dir.parent / '.teamcity' / 'config' / 'server-config.json'


def test_all_pages_are_valid():
    run_validator(AppConfig.send_bouncer_home,
                  AppConfig.pages_dir,
                  AppConfig.docs_config_file)
