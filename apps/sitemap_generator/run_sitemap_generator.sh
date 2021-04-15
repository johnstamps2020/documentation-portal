#!/bin/bash
set -xe

pip install poetry \
		&& poetry install --no-dev \
    && poetry run python -m sitemap_generator.main