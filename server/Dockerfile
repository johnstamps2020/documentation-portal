FROM artifactory.guidewire.com/hub-docker-remote/node:14-alpine

# Create app directory
WORKDIR /usr/src/app

RUN mkdir static
COPY package*.json ./
RUN npm install

COPY . .
COPY ./datadog-agent-conf.yaml /etc/conf.d/nodejs.d/conf.yaml

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

CMD [ "npm", "start" ]