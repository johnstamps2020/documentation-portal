FROM artifactory.guidewire.com/hub-docker-remote/python:3.8-slim-buster AS app-builder

COPY lion_page_builder /opt/app/lion_page_builder
COPY poetry.lock /opt/app
COPY pyproject.toml /opt/app
COPY README.md /opt/app
WORKDIR /opt/app
RUN pip install poetry
RUN poetry build -f wheel

FROM artifactory.guidewire.com/hub-docker-remote/python:3.8-slim-buster

COPY --from=app-builder /opt/app/dist/lion_page_builder-1.0.0-py3-none-any.whl /opt/app/
WORKDIR /opt/app
RUN pip install lion_page_builder-1.0.0-py3-none-any.whl --no-binary :all:

RUN rm -rf lion_page_builder-1.0.0-py3-none-any.whl
