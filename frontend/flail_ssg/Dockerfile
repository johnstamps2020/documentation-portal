FROM artifactory.guidewire.com/hub-docker-remote/python:3.8-slim-buster AS app-builder

COPY flail_ssg /opt/app/flail_ssg
COPY poetry.lock /opt/app
COPY pyproject.toml /opt/app
COPY README.md /opt/app
WORKDIR /opt/app
RUN pip install poetry
RUN poetry build -f wheel

FROM artifactory.guidewire.com/hub-docker-remote/python:3.8-slim-buster

RUN apt-get update && apt-get install -y build-essential \
    && apt-get install -y curl
COPY --from=app-builder /opt/app/dist/flail_ssg-0.1.0-py3-none-any.whl /opt/app/
WORKDIR /opt/app
RUN pip install flail_ssg-0.1.0-py3-none-any.whl

RUN rm -rf flail_ssg-0.1.0-py3-none-any.whl