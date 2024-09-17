FROM artifactory.guidewire.com/hub-docker-remote/node:18-alpine as app-builder

WORKDIR /usr/app

ARG NPM_AUTH_TOKEN
ARG TAG_VERSION
ARG DEPT_CODE
ARG POD_NAME

COPY .yarn .yarn
COPY .yarnrc.yml .yarnrc.yml
COPY package.json package.json
COPY yarn.lock yarn.lock
COPY server server
COPY landing-pages landing-pages
COPY shims shims
COPY scripts scripts
COPY core core

RUN yarn
RUN yarn build

FROM artifactory.guidewire.com/hub-docker-remote/nginx:1-alpine

COPY --from=app-builder /usr/app/landing-pages/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80
LABEL "org.opencontainers.image.title"="docportal-frontend" \
      "org.opencontainers.image.authors"="$POD_NAME@guidewire.com" \
      "org.opencontainers.image.url"="https://stash.guidewire.com/projects/DOCTOOLS/repos/documentation-portal" \
      "org.opencontainers.image.documentation"="https://stash.guidewire.com/projects/DOCTOOLS/repos/documentation-portal" \
      "org.opencontainers.image.version"="$TAG_VERSION" \
      "org.opencontainers.image.ref.name"="atmos" \
      "org.opencontainers.image.vendor"="guidewire" \
      "com.guidewire.dept"="$DEPT_CODE"

CMD ["nginx", "-g", "daemon off;"]