import dataclasses
import os
from dataclasses import dataclass
from enum import Enum
from pathlib import Path

from flail_ssg.access_controller import run_access_controller
from flail_ssg.config_generator import run_config_generator
from flail_ssg.generator import run_generator
from flail_ssg.publisher import run_publisher
from flail_ssg.template_writer import run_template_writer
from flail_ssg.validator import run_validator


class Bouncer(Enum):
    yes = True
    no = False


def resolve_path(path: str):
    if path:
        return Path.resolve(Path(path))
    return None


def validate_path(path: Path):
    if path:
        if path.exists():
            return path
        else:
            raise FileNotFoundError(
                f'The path does not exist:\nResolved path: {path}')
    return None


@dataclass
class AppConfig:
    root_build_dir: Path = Path.cwd() / 'build'
    pages_build_dir: Path = root_build_dir / 'pages'
    config_build_dir: Path = root_build_dir / 'config'
    _deploy_env: str = os.environ.get('DEPLOY_ENV')
    _pages_dir: str = os.environ.get('PAGES_DIR')
    _templates_dir: str = os.environ.get('TEMPLATES_DIR')
    _output_dir: str = os.environ.get('OUTPUT_DIR')
    _docs_config_file: str = os.environ.get('DOCS_CONFIG_FILE')
    _send_bouncer_home: str = os.environ.get('SEND_BOUNCER_HOME')

    @property
    def deploy_env(self):
        return self._deploy_env.casefold()

    @property
    def pages_dir(self):
        return validate_path(
            resolve_path(self._pages_dir)
        )

    @property
    def templates_dir(self):
        return validate_path(
            resolve_path(self._templates_dir)
        )

    @property
    def output_dir(self):
        return resolve_path(self._output_dir)

    @property
    def docs_config_file(self):
        return validate_path(
            resolve_path(self._docs_config_file)
        )

    @property
    def send_bouncer_home(self) -> bool:
        env_value = self._send_bouncer_home
        if env_value:
            return Bouncer[env_value.casefold()].value
        return False

    def get_app_config(self):
        missing_parameters = [
            field.name.upper().lstrip('_') for field in dataclasses.fields(self)
            if not getattr(self, field.name)
        ]
        if missing_parameters:
            raise SystemError(f'Missing environment variables:'
                              f'\n{", ".join(missing_parameters)}')
        return self


def main():
    app_config = AppConfig().get_app_config()
    run_validator(app_config.send_bouncer_home,
                  app_config.pages_dir,
                  app_config.docs_config_file)
    run_generator(app_config.send_bouncer_home,
                  app_config.deploy_env,
                  app_config.pages_dir,
                  app_config.pages_build_dir,
                  app_config.docs_config_file)
    run_access_controller(app_config.send_bouncer_home,
                          app_config.pages_build_dir,
                          app_config.docs_config_file)
    run_config_generator(app_config.send_bouncer_home,
                         app_config.pages_build_dir,
                         app_config.config_build_dir)
    run_template_writer(app_config.send_bouncer_home,
                        app_config.templates_dir,
                        app_config.pages_build_dir)
    run_publisher([app_config.pages_build_dir, app_config.config_build_dir],
                  app_config.output_dir)


if __name__ == '__main__':
    main()
