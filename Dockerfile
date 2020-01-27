FROM node:9.4.0-alpine as client

# Setup the client

WORKDIR /usr/app/client/
COPY client/package*.json ./
RUN npm install -qy
COPY client/ ./
RUN npm run build


# Setup the server

FROM node:9.4.0-alpine

WORKDIR /usr/app/
COPY --from=client /usr/app/client/build/ ./client/build/

WORKDIR /usr/app/server/
COPY ./package*.json ./
RUN npm install -qy
COPY ./ ./

EXPOSE 3001

# Args from docker-compose are passed as node env variables

CMD ["npm", "start"]
