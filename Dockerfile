# Setup the client

FROM node:9.4.0-alpine as client

WORKDIR /usr/app/client/
ENV SASS_BINARY_NAME linux-x64-59
COPY client/package*.json ./
RUN npm install -qy
COPY client/ ./
RUN npm run build

# Setup the server

FROM node:9.4.0-alpine

WORKDIR /usr/app/
COPY --from=client /usr/app/client/build/ ./client/build/

WORKDIR /usr/app/
COPY ./package*.json ./
RUN npm install -qy

COPY routers ./routers
COPY certificates ./certificates
COPY server.js ./

EXPOSE 3000

# environments from docker-compose are passed as node env variables

CMD ["npm", "start"]
