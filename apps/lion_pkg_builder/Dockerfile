FROM artifactory.guidewire.com/hub-docker-remote/python:3.9-slim-buster AS app-builder

COPY lion_pkg_builder /opt/app/lion_pkg_builder
COPY poetry.lock /opt/app
COPY pyproject.toml /opt/app
COPY README.md /opt/app
WORKDIR /opt/app
RUN pip install poetry
RUN poetry build -f wheel

FROM artifactory.guidewire.com/hub-docker-remote/python:3.9-slim-buster

COPY --from=app-builder /opt/app/dist/lion_pkg_builder-1.0.0-py3-none-any.whl /opt/app/
WORKDIR /opt/app
RUN pip install lion_pkg_builder-1.0.0-py3-none-any.whl --no-binary :all:

RUN rm -rf lion_pkg_builder-1.0.0-py3-none-any.whl
