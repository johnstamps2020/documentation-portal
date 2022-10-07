FROM artifactory.guidewire.com/hub-docker-remote/node:16.14.2-alpine as app-builder

WORKDIR /usr/src/app
COPY . .
RUN yarn
RUN yarn build
RUN mkdir dist/static

FROM artifactory.guidewire.com/hub-docker-remote/node:16.14.2-alpine

WORKDIR /usr/src/app

COPY --from=app-builder /usr/src/app/node_modules/ node_modules/
COPY --from=app-builder /usr/src/app/dist/ .

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