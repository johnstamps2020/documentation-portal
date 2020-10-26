FROM artifactory.guidewire.com/doctools-docker-dev/python:3.8-slim-buster AS app-builder

COPY config_deployer /opt/app/config_deployer
COPY poetry.lock /opt/app
COPY pyproject.toml /opt/app
COPY README.md /opt/app
WORKDIR /opt/app
RUN pip install poetry
RUN poetry build -f wheel

FROM artifactory.guidewire.com/doctools-docker-dev/python:3.8-slim-buster

COPY --from=app-builder /opt/app/dist/config_deployer-1.0.0-py3-none-any.whl /opt/app/
WORKDIR /opt/app
RUN pip install config_deployer-1.0.0-py3-none-any.whl --no-binary :all:

RUN rm -rf config_deployer-1.0.0-py3-none-any.whl
