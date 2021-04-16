FROM artifactory.guidewire.com/hub-docker-remote/node:14-alpine

# Create app directory
WORKDIR /usr/src/app

RUN mkdir static
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8081
CMD [ "npm", "start" ]