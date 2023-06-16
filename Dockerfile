FROM node:19-alpine

WORKDIR /usr/src/app
COPY package*.json ./
COPY ./public ./public
COPY ./cli ./cli
COPY ./base-files ./base-files

CMD npm config set prefer-offline && \
    npm install && \
    npm run start:dev