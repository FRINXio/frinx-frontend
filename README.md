# Frinx UniConfig tool

## Installation 

#### Requirements
* [Docker](https://www.docker.com/)   

In the project directory, run: 
#### `docker build --build-arg "ODL=<ip>:8181" --build-arg "WF_SERVER=<ip>:8080" --build-arg "REACT_APP_LOGIN_ENABLED=true" -t uniconfig-ui .` <br>
Creates docker container with installation of UniConfig-UI. <br>

## Startup <br>
In the project directory, run: 

#### `docker run -e NODE_PORT=3000 -d -p 3000:3000 uniconfig-ui` <br>
Starts the UniConfig-UI container using ODL/WF_SERVER host defined at installation.

Open web browser with URL `http://localhost:3000/`
