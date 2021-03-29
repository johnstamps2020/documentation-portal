FROM artifactory.guidewire.com/hub-docker-remote/python:3.8-slim-buster AS app-builder

COPY sitemap_generator /opt/app/sitemap_generator
COPY poetry.lock /opt/app
COPY pyproject.toml /opt/app
COPY README.md /opt/app
WORKDIR /opt/app
RUN pip install poetry
RUN poetry build -f wheel

FROM artifactory.guidewire.com/hub-docker-remote/python:3.8-slim-buster

RUN apt-get update && apt-get install -y curl

COPY --from=app-builder /opt/app/dist/sitemap_generator-1.0.0-py3-none-any.whl /opt/app/
WORKDIR /opt/app
RUN pip install sitemap_generator-1.0.0-py3-none-any.whl --no-binary :all:

RUN rm -rf sitemap_generator-1.0.0-py3-none-any.whl
