# syntax=docker/dockerfile:1

FROM node:latest


ENV HOME=/home/app

WORKDIR $HOME/node_docker/Server
COPY  package*.json $HOME/node_docker/Server/
COPY  ./ $HOME/node_docker/Server/
RUN npm install --silent --progress=false

WORKDIR $HOME/node_docker/Client
COPY package*.json $HOME/node_docker/Client/
COPY ./ $HOME/node_docker/Client/
RUN mkdir -p /Public
RUN npm install --silent --progress=false
RUN npm run build



COPY ./Public $HOME/node_docker/Server/

WORKDIR $HOME/node_docker/Server

CMD ["npm", "start"]
