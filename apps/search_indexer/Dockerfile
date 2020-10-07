FROM python:3.8-slim-buster AS app-builder

COPY search_indexer /opt/app/search_indexer
COPY poetry.lock /opt/app
COPY pyproject.toml /opt/app
COPY README.md /opt/app
WORKDIR /opt/app
RUN pip install poetry
RUN poetry build -f wheel

FROM python:3.8-slim-buster

RUN apt-get update && apt-get install -y build-essential
COPY --from=app-builder /opt/app/dist/search_indexer-1.0.0-py3-none-any.whl /opt/app/
WORKDIR /opt/app
RUN pip install search_indexer-1.0.0-py3-none-any.whl

RUN rm -rf search_indexer-1.0.0-py3-none-any.whl
