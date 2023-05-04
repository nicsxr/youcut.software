# syntax=docker/dockerfile:1

FROM node:latest as build-stage

WORKDIR /usr/app/

COPY Client/package*.json ./
RUN npm install --silent --progress=false
COPY Client/ ./
RUN npm run build


FROM node:latest as deploy-stage
WORKDIR /usr/app/


COPY --from=build-stage /usr/app/PublicBuild/ ./PublicBuild

COPY  package*.json ./

RUN npm install --silent --progress=false

COPY Server/ ./

CMD ["npm", "start"]
