FROM artifactory.guidewire.com/hub-docker-remote/python:3.8-slim-buster AS app-builder

COPY l10n_page_builder /opt/app/l10n_page_builder
COPY poetry.lock /opt/app
COPY pyproject.toml /opt/app
COPY README.md /opt/app
WORKDIR /opt/app
RUN pip install poetry
RUN poetry build -f wheel

FROM artifactory.guidewire.com/hub-docker-remote/python:3.8-slim-buster

COPY --from=app-builder /opt/app/dist/l10n_page_builder-1.0.0-py3-none-any.whl /opt/app/
WORKDIR /opt/app
RUN pip install l10n_page_builder-1.0.0-py3-none-any.whl --no-binary :all:

RUN rm -rf l10n_page_builder-1.0.0-py3-none-any.whl
