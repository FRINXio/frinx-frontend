# Frinx UniConfig tool

## Installation 

#### Requirements
* [Docker](https://www.docker.com/)   

In the project directory, run: 
#### `docker build -t uniconfig-ui .` <br>
Creates docker container with installation of UniConfig-UI. <br>

## Startup <br>
In the project directory, run: 

#### `docker run -e NODE_PORT=3000 -d -p 3000:3000 uniconfig-ui` <br>
Starts the UniConfig-UI container using ODL/WF_SERVER host defined at installation.

## Start with https
With predefined certificate:
#### `docker run -v /home/user/cert:/usr/app/server/certificates -e NODE_PORT=3000 -e HTTPS=true -p 3000:3000 uniconfig-ui` <br> <br>

With automatically gnerated and renewed certificate:
#### `docker run -e GEN_CERTIFICATE=true -e HTTPS=true -e OPENSSL_COMMAND_TO_GEN_CERT='openssl req  -nodes -new -x509 -days 360 -keyout key.pem -out cert.pem -subj "/C=US/ST=Oregon/L=Portland/O=Company Name/OU=Org/CN=www.example.com"' -e RENEW_PERIOD=30000 -e NODE_PORT=3000 -p 3000:3000 uniconfig-ui`<br>

## Env variables list:

* NODE_PORT - server listening on this port, default: 4000
* NODE_HOST
* HTTPS - if true will run HTTPS server
* OPENSSL_COMMAND_TO_GEN_CERT - command to generate certificate with(supports openssl only)
* RENEW_PERIOD - certificate autogeneration period
* PASSPHRASE 

Open web browser with URL `http://localhost:3000/`
