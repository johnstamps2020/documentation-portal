FROM python:3.8-slim

RUN apt-get update \
    && apt-get -y install build-essential \
    && apt-get -y install git \
    && apt-get -y install curl \
    && curl -sSL https://raw.githubusercontent.com/sdispater/poetry/master/get-poetry.py | python

RUN mkdir ~/.ssh \
    && echo "Host stash.guidewire.com" >> ~/.ssh/config \
    && echo "    StrictHostKeyChecking no" >> ~/.ssh/config