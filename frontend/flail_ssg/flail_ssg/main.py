import os

from flail_ssg.generator import run_generator
from flail_ssg.validator import run_validator


def main():
    bouncer_mode = True
    if os.environ['SEND_BOUNCER_HOME'] == 'yes':
        bouncer_mode = False
    run_validator(bouncer_mode)
    run_generator(os.environ['DEPLOY_ENV'])


if __name__ == '__main__':
    main()
