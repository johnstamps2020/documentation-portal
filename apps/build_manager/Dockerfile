FROM artifactory.guidewire.com/hub-docker-remote/python:3.9-slim-buster AS app-builder

COPY build_manager /opt/app/build_manager
COPY poetry.lock /opt/app
COPY pyproject.toml /opt/app
COPY README.md /opt/app
WORKDIR /opt/app
RUN pip install poetry
RUN poetry build -f wheel

FROM artifactory.guidewire.com/hub-docker-remote/python:3.9-slim-buster

COPY --from=app-builder /opt/app/dist/build_manager-1.0.0-py3-none-any.whl /opt/app/
WORKDIR /opt/app
RUN pip install build_manager-1.0.0-py3-none-any.whl --no-binary :all:

RUN rm -rf build_manager-1.0.0-py3-none-any.whl
