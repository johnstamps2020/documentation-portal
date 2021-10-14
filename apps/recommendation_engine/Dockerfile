FROM artifactory.guidewire.com/hub-docker-remote/python:3.9-slim-buster AS app-builder

COPY recommendation_engine /opt/app/recommendation_engine
COPY poetry.lock /opt/app
COPY pyproject.toml /opt/app
COPY README.md /opt/app
WORKDIR /opt/app
RUN pip install poetry
RUN poetry build -f wheel

FROM artifactory.guidewire.com/hub-docker-remote/python:3.9-slim-buster

COPY --from=app-builder /opt/app/dist/recommendation_engine-0.1.0-py3-none-any.whl /opt/app/
RUN apt-get update \
  && apt-get install build-essential -y \
  && apt-get clean
WORKDIR /opt/app
RUN pip install recommendation_engine-0.1.0-py3-none-any.whl

RUN rm -rf recommendation_engine-0.1.0-py3-none-any.whl
RUN apt-get remove -y build-essential \
    && apt-get -y autoremove
