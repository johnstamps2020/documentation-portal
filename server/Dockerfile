FROM artifactory.guidewire.com/hub-docker-remote/node:16.14.2-alpine

# Create app directory
WORKDIR /usr/src/app

RUN mkdir static
COPY package.json .
COPY yarn.lock .
COPY .yarn/ .yarn/
COPY .yarnrc.yml .
RUN yarn

COPY . .

EXPOSE 8081
ARG tag_version
LABEL "org.opencontainers.image.title"="docportal" \
      "org.opencontainers.image.authors"="doctools@guidewire.com" \
      "org.opencontainers.image.url"="https://stash.guidewire.com/projects/DOCTOOLS/repos/documentation-portal" \
      "org.opencontainers.image.documentation"="https://stash.guidewire.com/projects/DOCTOOLS/repos/documentation-portal" \
      "org.opencontainers.image.version"=$tag_version \
      "org.opencontainers.image.ref.name"="atmos" \
      "org.opencontainers.image.vendor"="guidewire" \
      "com.guidewire.dept"="100653"

CMD [ "node", "server.js" ]