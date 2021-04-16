FROM artifactory.guidewire.com/hub-docker-remote/node:14-alpine

# Create app directory
WORKDIR /usr/src/app

RUN mkdir -p static/pages static/sitemap
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8081
CMD [ "npm", "start" ]