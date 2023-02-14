FROM artifactory.guidewire.com/hub-docker-remote/node:16.16.0-alpine as app-builder

# Create app directory
WORKDIR /usr/app

ARG NPM_AUTH_TOKEN
ARG TAG_VERSION
ARG DEPT_CODE
ARG POD_NAME

# COPY files we need to install dependencies
COPY package.json .
COPY yarn.lock .
COPY .yarn/ .yarn/
COPY .yarnrc.yml .
COPY server/package.json ./server/package.json

# install dependencies
RUN yarn

# create a "static" folder

COPY . .
RUN mkdir server/static

EXPOSE 8081
LABEL "org.opencontainers.image.title"="docportal" \
      "org.opencontainers.image.authors"="$POD_NAME@guidewire.com" \
      "org.opencontainers.image.url"="https://stash.guidewire.com/projects/DOCTOOLS/repos/documentation-portal" \
      "org.opencontainers.image.documentation"="https://stash.guidewire.com/projects/DOCTOOLS/repos/documentation-portal" \
      "org.opencontainers.image.version"="$TAG_VERSION" \
      "org.opencontainers.image.ref.name"="atmos" \
      "org.opencontainers.image.vendor"="guidewire" \
      "com.guidewire.dept"="$DEPT_CODE"

ENV NODE_ENV=production
CMD [ "node", "server/server.js" ]