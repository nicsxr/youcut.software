# syntax=docker/dockerfile:1

FROM node:latest as build-stage


ENV HOME=/home/app

WORKDIR $HOME/node_docker/Client
COPY package*.json ./
RUN npm install --silent --progress=false
COPY . .
RUN npm run build


FROM node:latest as deploy-stage
WORKDIR $HOME/node_docker/Server

COPY  package*.json ./
RUN npm install --silent --progress=false

COPY --from=build-stage /home/app/BuildFiles /home/app/node_docker/Server




COPY . .

CMD ["npm", "start"]
