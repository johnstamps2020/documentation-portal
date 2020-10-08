FROM python:3.8-slim-buster AS app-builder

COPY index_cleaner /opt/app/index_cleaner
COPY poetry.lock /opt/app
COPY pyproject.toml /opt/app
COPY README.md /opt/app
WORKDIR /opt/app
RUN pip install poetry
RUN poetry build -f wheel

FROM python:3.8-slim-buster

RUN apt-get update && apt-get install -y curl

COPY --from=app-builder /opt/app/dist/index_cleaner-1.0.0-py3-none-any.whl /opt/app/
WORKDIR /opt/app
RUN pip install index_cleaner-1.0.0-py3-none-any.whl --no-binary :all:

RUN rm -rf index_cleaner-1.0.0-py3-none-any.whl
