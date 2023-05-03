# syntax=docker/dockerfile:1

FROM node:latest


ENV HOME=/home/app

WORKDIR $HOME/node_docker/Client
COPY ./Client $HOME/node_docker/Client

RUN npm install --silent --progress=false
RUN npm run build

WORKDIR $HOME/node_docker/Server
COPY ./Server $HOME/node_docker/Server

RUN npm install --silent --progress=false

CMD ["npm", "start"]
